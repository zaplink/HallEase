'use server';

import { NextRequest, NextResponse } from 'next/server';
import mailjet from 'node-mailjet';

const mailjetClient = mailjet.apiConnect(
	process.env.MAILJET_API_KEY!,
	process.env.MAILJET_API_SECRET!
);

function buildStatusUpdateEmail({
	eventName,
	eventLocation,
	eventDateTime,
	reservationId,
	reservationLink,
	status,
	requesterName,
}: {
	eventName: string;
	eventLocation: string;
	eventDateTime: string;
	reservationId: string;
	reservationLink: string;
	status: 'approved' | 'rejected';
	requesterName: string;
}) {
	const statusColor = status === 'approved' ? '#16a34a' : '#dc2626';
	const statusText = status === 'approved' ? 'Approved' : 'Rejected';
	const message =
		status === 'approved'
			? 'Your reservation has been approved. You can now proceed with your planned event.'
			: 'Your reservation has been rejected. Please submit a new request if needed.';

	return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Reservation Status Update</title>
            <style>
                body {
                    background: #f8fafc;
                    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
                    color: #0f172a;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 480px;
                    margin: 40px auto;
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px 0 #0001;
                    padding: 32px 24px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 24px;
                }
                .title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: ${statusColor};
                    margin-bottom: 8px;
                }
                .subtitle {
                    font-size: 1rem;
                    color: #64748b;
                    margin-bottom: 24px;
                }
                .message {
                    text-align: center;
                    margin-bottom: 24px;
                    color: #334155;
                }
                .details {
                    background: #f1f5f9;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 24px;
                }
                .details-row {
                    margin-bottom: 8px;
                }
                .label {
                    font-weight: 600;
                    color: #334155;
                }
                .value {
                    color: #0f172a;
                }
                .button {
                    display: inline-block;
                    background: #111827;
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    line-height: 1.25rem;
                    font-weight: 500;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    transition: background-color 0.2s;
                    -webkit-text-fill-color: #ffffff;
                }
                .button:hover {
                    background: #1f2937;
                    color: #ffffff !important;
                }
                .footer {
                    margin-top: 32px;
                    text-align: center;
                    font-size: 0.9rem;
                    color: #94a3b8;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="title">Reservation ${statusText}</div>
                    <div class="subtitle">Hello ${requesterName}</div>
                </div>
                <div class="message">${message}</div>
                <div class="details">
                    <div class="details-row"><span class="label">Event:</span> <span class="value">${eventName}</span></div>
                    <div class="details-row"><span class="label">Location:</span> <span class="value">${eventLocation}</span></div>
                    <div class="details-row"><span class="label">Date & Time:</span> <span class="value">${eventDateTime}</span></div>
                    <div class="details-row"><span class="label">Reservation ID:</span> <span class="value">${reservationId}</span></div>
                </div>
                <div style="text-align:center;">
                    <a href="${reservationLink}" class="button">View Reservation</a>
                </div>
                <div class="footer">
                    Thank you for using HallEase.<br/>
                    <span style="color: #64748b; font-size: 0.8rem; margin-top: 8px; display: block;">This is an automated message. Please do not reply to this email.</span>
                </div>
            </div>
        </body>
        </html>
    `;
}

export async function POST(req: NextRequest) {
	try {
		const {
			toEmail,
			eventName,
			eventDateTime,
			eventLocation,
			reservationId,
			status,
			requesterName,
		} = await req.json();

		// Validate all required fields
		const requiredFields = {
			toEmail,
			eventName,
			eventDateTime,
			eventLocation,
			reservationId,
			status,
			requesterName,
		};

		const missingFields = Object.entries(requiredFields)
			.filter(([_, value]) => !value)
			.map(([key]) => key);

		if (missingFields.length > 0) {
			return NextResponse.json(
				{
					error: 'Missing required fields',
					missingFields,
				},
				{ status: 400 }
			);
		}

		if (
			!process.env.MAILJET_API_KEY ||
			!process.env.MAILJET_API_SECRET ||
			!process.env.MAILJET_SENDER_EMAIL
		) {
			return NextResponse.json(
				{
					error: 'Missing Mailjet environment variables.',
					details: 'Email service configuration is incomplete.',
				},
				{ status: 500 }
			);
		}

		if (!status || (status !== 'approved' && status !== 'rejected')) {
			return NextResponse.json(
				{
					error: 'Invalid status value',
					details: 'Status must be either "approved" or "rejected".',
					receivedStatus: status,
				},
				{ status: 400 }
			);
		}

		// URL encode reservationId in case it contains special characters
		const formattedReservationLink = `https://hallease.zaploq.com/reservation/${encodeURIComponent(reservationId)}`;

		const result = await mailjetClient
			.post('send', { version: 'v3.1' })
			.request({
				Messages: [
					{
						From: {
							Email: process.env.MAILJET_SENDER_EMAIL!,
							Name: 'HallEase',
						},
						To: [{ Email: toEmail }],
						Subject: `Reservation ${status === 'approved' ? 'Approved' : 'Rejected'}`,
						HTMLPart: buildStatusUpdateEmail({
							eventName,
							eventLocation,
							eventDateTime,
							reservationId,
							reservationLink: formattedReservationLink,
							status,
							requesterName,
						}),
					},
				],
			});

		return NextResponse.json({
			success: true,
			mailjetResponse: result.body,
		});
	} catch (err) {
		console.error('Mailjet Error:', err);
		const error = err as Error;
		const errorResponse = {
			error: 'Failed to send email',
			details: error?.message || 'Unknown error',
			errorType: error?.name,
			timestamp: new Date().toISOString(),
			mailjetError:
				err instanceof Error
					? {
							name: error.name,
							message: error.message,
							statusCode: (err as any).statusCode,
							errorIdentifier: (err as any).ErrorIdentifier,
							errorCode: (err as any).ErrorCode,
							response:
								process.env.NODE_ENV === 'development'
									? (err as any).response
									: undefined,
						}
					: undefined,
			stack:
				process.env.NODE_ENV === 'development'
					? error?.stack
					: undefined,
		};
		console.error(
			'Email send error details:',
			JSON.stringify(errorResponse, null, 2)
		);
		return NextResponse.json(errorResponse, { status: 500 });
	}
}
