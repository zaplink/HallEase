import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
	try {
		console.log('Testing database connection...');
		const supabase = await createClient();

		// Test basic connection
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError) {
			console.error('Auth error:', authError);
			return NextResponse.json({
				success: false,
				error: 'Authentication error',
				details: authError.message,
			});
		}

		if (!user) {
			return NextResponse.json({
				success: false,
				error: 'No authenticated user',
			});
		}

		// Test if issue_reports table exists
		const { data: tableCheck, error: tableError } = await supabase
			.from('issue_reports')
			.select('count')
			.limit(1);

		if (tableError) {
			console.error('Table check error:', tableError);
			return NextResponse.json({
				success: false,
				error: 'issue_reports table not found',
				details: tableError.message,
				suggestion:
					'Please run the SQL migration script in your Supabase database',
			});
		}

		// Test profiles table access
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('id, full_name')
			.eq('id', user.id)
			.single();

		if (profileError) {
			console.error('Profile error:', profileError);
			return NextResponse.json({
				success: false,
				error: 'Cannot access profiles table',
				details: profileError.message,
			});
		}

		return NextResponse.json({
			success: true,
			message: 'Database connection successful',
			user: {
				id: user.id,
				email: user.email,
				profile: profile,
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error);
		return NextResponse.json({
			success: false,
			error: 'Unexpected error',
			details: error instanceof Error ? error.message : 'Unknown error',
		});
	}
}
