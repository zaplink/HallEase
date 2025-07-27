import { NextRequest, NextResponse } from 'next/server';
import mailjet from 'node-mailjet';

const mailjetClient = mailjet.apiConnect(
	process.env.MAILJET_API_KEY!,
	process.env.MAILJET_API_SECRET!
);

function buildReservationEmail({
	eventName,
	eventLocation,
	eventDateTime,
	reservationId,
	reservationLink,
}: {
	eventName: string;
	eventLocation: string;
	eventDateTime: string;
	reservationId: string;
	reservationLink: string;
}) {
	return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Reservation Submitted</title>
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
                    color: #0f172a;
                    margin-bottom: 8px;
                }
                .subtitle {
                    font-size: 1rem;
                    color: #64748b;
                    margin-bottom: 24px;
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
                    <div class="title">Reservation Submitted</div>
                    <div class="subtitle">Your reservation request has been received!</div>
                </div>
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
                    You will receive another email when your reservation is approved or rejected.<br/>
                    <span style="color: #64748b; font-size: 0.8rem; margin-top: 8px; display: block;">This is an automated message. Please do not reply to this email.</span>
                </div>
            </div>
        </body>
        </html>
    `;
}

export async function POST(req: NextRequest) {
	const {
		toEmail,
		eventName: rawEventName,
		eventDateTime: rawEventDateTime,
		reservationType,
		hall,
		reservationId,
	} = await req.json();

	// Fallbacks for missing/empty fields
	const eventName =
		rawEventName && String(rawEventName).trim() ? rawEventName : 'N/A';
	const eventDateTime =
		rawEventDateTime && String(rawEventDateTime).trim()
			? rawEventDateTime
			: 'N/A';

	// Set location based on reservation type
	let eventLocation = 'N/A';
	if (reservationType === 'availability') {
		eventLocation = 'Notified on Availability';
	} else if (reservationType === 'manual') {
		eventLocation = hall
			? `Requested ${hall}`
			: 'Manual Selection (No Hall Selected)';
	}

	console.log('Email Data:', {
		eventName,
		eventLocation,
		eventDateTime,
		reservationType,
		hall,
	});

	if (
		!process.env.MAILJET_API_KEY ||
		!process.env.MAILJET_API_SECRET ||
		!process.env.MAILJET_SENDER_EMAIL
	) {
		return NextResponse.json(
			{ error: 'Missing Mailjet environment variables.' },
			{ status: 500 }
		);
	}

	// URL encode reservationId in case it contains special characters
	const formattedReservationLink = `https://hallease.zaploq.com/reservation/${encodeURIComponent(reservationId)}`;

	try {
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
						Subject: 'Your Reservation Has Been Submitted',
						HTMLPart: buildReservationEmail({
							eventName,
							eventLocation,
							eventDateTime,
							reservationId,
							reservationLink: formattedReservationLink,
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
		return NextResponse.json(
			{
				error: 'Failed to send email',
				details: error?.message || 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
