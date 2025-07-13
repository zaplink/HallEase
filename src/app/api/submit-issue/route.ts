import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import mailjet from 'node-mailjet';

// Initialize Mailjet client
const mailjetClient = mailjet.apiConnect(
	process.env.MAILJET_API_KEY!,
	process.env.MAILJET_API_SECRET!
);

export async function POST(req: NextRequest) {
	try {
		console.log('API: Starting issue submission process');
		const supabase = await createClient();

		// Get the current user
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError) {
			console.error('API: Auth error:', authError);
			return NextResponse.json(
				{ error: 'Authentication error', details: authError.message },
				{ status: 401 }
			);
		}

		if (!user) {
			console.error('API: No user found');
			return NextResponse.json(
				{ error: 'Authentication required - no user found' },
				{ status: 401 }
			);
		}

		console.log('API: User authenticated:', user.id);

		// Parse form data
		const formData = await req.formData();
		const issueType = formData.get('issueType') as string;
		const title = (formData.get('title') as string) || null;
		const description = formData.get('description') as string;
		const screenshotFile = formData.get('screenshot') as File | null;

		console.log('API: Form data parsed:', {
			issueType,
			title,
			description: description?.length,
			hasScreenshot: !!screenshotFile,
		});

		// Validate required fields
		if (!issueType || !description) {
			console.error('API: Missing required fields');
			return NextResponse.json(
				{ error: 'Issue type and description are required' },
				{ status: 400 }
			);
		}

		if (!['booking', 'technical', 'other'].includes(issueType)) {
			console.error('API: Invalid issue type:', issueType);
			return NextResponse.json(
				{ error: 'Invalid issue type' },
				{ status: 400 }
			);
		}

		let screenshotUrl = null;

		// Handle file upload if screenshot is provided
		if (screenshotFile && screenshotFile.size > 0) {
			const fileExt = screenshotFile.name.split('.').pop();
			const fileName = `${user.id}-${Date.now()}.${fileExt}`;

			try {
				// Convert file to buffer
				const bytes = await screenshotFile.arrayBuffer();
				const buffer = Buffer.from(bytes);

				// Upload to Supabase Storage
				const { data: uploadData, error: uploadError } =
					await supabase.storage
						.from('issue-screenshots')
						.upload(`screenshots/${fileName}`, buffer, {
							contentType: screenshotFile.type,
							upsert: false,
						});

				if (uploadError) {
					console.error('Screenshot upload error:', uploadError);
					// Continue without screenshot rather than failing
				} else {
					// Get public URL
					const {
						data: { publicUrl },
					} = supabase.storage
						.from('issue-screenshots')
						.getPublicUrl(uploadData.path);

					screenshotUrl = publicUrl;
				}
			} catch (fileError) {
				console.error('File processing error:', fileError);
				// Continue without screenshot rather than failing
			}
		}

		// Get user profile information
		console.log('API: Fetching user profile');
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('full_name, email, role')
			.eq('id', user.id)
			.single();

		if (profileError) {
			console.error('API: Profile fetch error:', profileError);
		} else {
			console.log('API: Profile fetched successfully');
		}

		// Insert issue report into database
		console.log('API: Inserting issue report into database');
		const { data: issueReport, error: insertError } = await supabase
			.from('issue_reports')
			.insert({
				issue_type: issueType,
				title: title,
				description: description,
				screenshot_url: screenshotUrl,
				status: 'open',
				priority: 'medium',
				reporter_id: user.id,
				created_date: new Date().toISOString().split('T')[0],
				created_time: new Date().toTimeString().split(' ')[0],
			})
			.select()
			.single();

		if (insertError) {
			console.error('API: Database insert error:', insertError);
			return NextResponse.json(
				{
					error: 'Failed to submit issue report',
					details: insertError.message,
				},
				{ status: 500 }
			);
		}

		console.log('API: Issue report inserted successfully:', issueReport.id);

		// Send notification email to admins
		try {
			await sendAdminNotification({
				issueId: issueReport.id,
				issueType,
				title: title || 'No title provided',
				description,
				reporterName: profile?.full_name || 'Unknown User',
				reporterEmail: profile?.email || user.email || 'No email',
				screenshotUrl,
			});
		} catch (emailError) {
			console.error('Failed to send admin notification:', emailError);
			// Don't fail the request if email fails
		}

		return NextResponse.json({
			success: true,
			message: 'Issue report submitted successfully',
			issueId: issueReport.id,
		});
	} catch (error) {
		console.error('API: Unexpected error in issue submission:', error);
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ error: 'Internal server error', details: errorMessage },
			{ status: 500 }
		);
	}
}

async function sendAdminNotification({
	issueId,
	issueType,
	title,
	description,
	reporterName,
	reporterEmail,
	screenshotUrl,
}: {
	issueId: string;
	issueType: string;
	title: string;
	description: string;
	reporterName: string;
	reporterEmail: string;
	screenshotUrl?: string | null;
}) {
	if (
		!process.env.MAILJET_API_KEY ||
		!process.env.MAILJET_API_SECRET ||
		!process.env.MAILJET_SENDER_EMAIL
	) {
		throw new Error('Email configuration missing');
	}

	const issueLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://hallease.zaploq.com'}/admin/issues/${issueId}`;

	const htmlContent = buildAdminNotificationEmail({
		issueId,
		issueType,
		title,
		description,
		reporterName,
		reporterEmail,
		screenshotUrl,
		issueLink,
	});

	// In a real scenario, you'd fetch admin emails from the database
	// For now, using environment variable
	const adminEmails = process.env.ADMIN_NOTIFICATION_EMAILS?.split(',') || [];

	if (adminEmails.length === 0) {
		console.warn('No admin emails configured for issue notifications');
		return;
	}

	const recipients = adminEmails.map((email) => ({ Email: email.trim() }));

	await mailjetClient.post('send', { version: 'v3.1' }).request({
		Messages: [
			{
				From: {
					Email: process.env.MAILJET_SENDER_EMAIL!,
					Name: 'HallEase System',
				},
				To: recipients,
				Subject: `New Issue Report: ${issueType.toUpperCase()} - ${title}`,
				HTMLPart: htmlContent,
			},
		],
	});
}

function buildAdminNotificationEmail({
	issueId,
	issueType,
	title,
	description,
	reporterName,
	reporterEmail,
	screenshotUrl,
	issueLink,
}: {
	issueId: string;
	issueType: string;
	title: string;
	description: string;
	reporterName: string;
	reporterEmail: string;
	screenshotUrl?: string | null;
	issueLink: string;
}) {
	const priorityColor =
		issueType === 'technical'
			? '#dc2626'
			: issueType === 'booking'
				? '#f59e0b'
				: '#6b7280';

	return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
			<title>New Issue Report</title>
			<style>
				body {
					background: #f8fafc;
					font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
					color: #0f172a;
					margin: 0;
					padding: 0;
				}
				.container {
					max-width: 600px;
					margin: 40px auto;
					background: #fff;
					border-radius: 12px;
					box-shadow: 0 2px 8px 0 #0001;
					padding: 32px 24px;
				}
				.header {
					text-align: center;
					margin-bottom: 32px;
				}
				.logo {
					color: #1e40af;
					font-size: 24px;
					font-weight: 700;
					margin-bottom: 8px;
				}
				.title {
					color: #dc2626;
					font-size: 20px;
					font-weight: 600;
					margin-bottom: 16px;
				}
				.issue-info {
					background: #f8fafc;
					border-radius: 8px;
					padding: 20px;
					margin-bottom: 24px;
				}
				.issue-type {
					display: inline-block;
					padding: 4px 12px;
					border-radius: 20px;
					color: white;
					font-size: 12px;
					font-weight: 600;
					text-transform: uppercase;
					margin-bottom: 12px;
				}
				.field {
					margin-bottom: 16px;
				}
				.field-label {
					font-weight: 600;
					color: #374151;
					margin-bottom: 4px;
				}
				.field-value {
					color: #6b7280;
					line-height: 1.5;
				}
				.button {
					display: inline-block;
					background: #1e40af;
					color: white;
					padding: 12px 24px;
					border-radius: 8px;
					text-decoration: none;
					font-weight: 600;
					margin: 20px 0;
				}
				.footer {
					text-align: center;
					color: #9ca3af;
					font-size: 14px;
					margin-top: 32px;
				}
				.screenshot {
					max-width: 100%;
					border-radius: 8px;
					margin-top: 8px;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<div class="logo">🏢 HallEase</div>
					<div class="title">New Issue Report Submitted</div>
				</div>

				<div class="issue-info">
					<div class="issue-type" style="background-color: ${priorityColor};">
						${issueType.toUpperCase()}
					</div>
					
					<div class="field">
						<div class="field-label">Issue ID:</div>
						<div class="field-value">#${issueId.substring(0, 8)}</div>
					</div>

					<div class="field">
						<div class="field-label">Title:</div>
						<div class="field-value">${title}</div>
					</div>

					<div class="field">
						<div class="field-label">Description:</div>
						<div class="field-value">${description}</div>
					</div>

					<div class="field">
						<div class="field-label">Reported by:</div>
						<div class="field-value">${reporterName} (${reporterEmail})</div>
					</div>

					<div class="field">
						<div class="field-label">Submitted:</div>
						<div class="field-value">${new Date().toLocaleString()}</div>
					</div>

					${
						screenshotUrl
							? `
						<div class="field">
							<div class="field-label">Screenshot:</div>
							<div class="field-value">
								<a href="${screenshotUrl}" target="_blank">View Screenshot</a>
							</div>
						</div>
					`
							: ''
					}
				</div>

				<div style="text-align: center;">
					<a href="${issueLink}" class="button">
						View Issue Details
					</a>
				</div>

				<div class="footer">
					<p>This is an automated notification from HallEase System.</p>
					<p>Please respond to this issue promptly to maintain user satisfaction.</p>
				</div>
			</div>
		</body>
		</html>
	`;
}
