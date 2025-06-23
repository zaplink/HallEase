import { NextRequest, NextResponse } from 'next/server';
import mailjet from 'node-mailjet';

const mailjetClient = mailjet.apiConnect(
	process.env.MAILJET_API_KEY!,
	process.env.MAILJET_API_SECRET!
);

export async function POST(req: NextRequest) {
	console.log('MAILJET_API_KEY:', process.env.MAILJET_API_KEY);
	console.log('MAILJET_API_SECRET:', process.env.MAILJET_API_SECRET);
	console.log('MAILJET_SENDER_EMAIL:', process.env.MAILJET_SENDER_EMAIL);
	console.log('MAILJET_TEMPLATE_ID:', process.env.MAILJET_TEMPLATE_ID);

	if (
		!process.env.MAILJET_API_KEY ||
		!process.env.MAILJET_API_SECRET ||
		!process.env.MAILJET_SENDER_EMAIL ||
		!process.env.MAILJET_TEMPLATE_ID
	) {
		return NextResponse.json(
			{
				error: 'One or more environment variables are undefined',
				MAILJET_API_KEY: process.env.MAILJET_API_KEY ?? null,
				MAILJET_API_SECRET: process.env.MAILJET_API_SECRET ?? null,
				MAILJET_SENDER_EMAIL: process.env.MAILJET_SENDER_EMAIL ?? null,
				MAILJET_TEMPLATE_ID: process.env.MAILJET_TEMPLATE_ID ?? null,
			},
			{ status: 500 }
		);
	}

	const {
		toEmail,
		eventName,
		eventLocation,
		eventDateTime,
		reservationId,
		reservationLink,
	} = await req.json();

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
						TemplateID: Number(process.env.MAILJET_TEMPLATE_ID),
						TemplateLanguage: true,
						Subject: 'Reservation Request Approved',
						Variables: {
							eventName: eventName || 'Test Event',
							eventLocation: eventLocation || 'Test Location',
							eventDateTime:
								eventDateTime || '2023-10-01 10:00 AM',
							requester: toEmail || 'John Doe',
							reservationId: reservationId || '123456',
							reservationLink:
								reservationLink ||
								'https://example.com/reservation/123456',
						},
					},
				],
			});

		console.log('Mailjet response:', JSON.stringify(result.body, null, 2));
		return NextResponse.json({
			success: true,
			mailjetResponse: result.body,
		});
	} catch (err: unknown) {
		let statusCode = 500;
		let errorDetails = undefined;

		if (
			typeof err === 'object' &&
			err !== null &&
			'statusCode' in err &&
			'response' in err &&
			typeof (err as { response?: unknown }).response === 'object' &&
			(err as { response?: { body?: unknown } }).response &&
			'body' in (err as { response: { body?: unknown } }).response
		) {
			statusCode = (err as { statusCode: number }).statusCode;
			errorDetails = (err as { response: { body: unknown } }).response
				.body;
			console.error('Mailjet Error:', statusCode, errorDetails);
		} else {
			console.error('Mailjet Error:', err);
		}

		return NextResponse.json(
			{ error: 'Failed to send email', details: errorDetails },
			{ status: statusCode }
		);
	}
}
