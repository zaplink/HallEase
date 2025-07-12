// Simple test to verify database connection and schema
import { supabase } from '@/lib/supabaseClient';

export async function testDatabaseConnection() {
	try {
		console.log('Testing database connection...');

		// Test each table mentioned in tables.txt
		const tables = [
			'reserve',
			'hall',
			'profiles',
			'event',
			'extra_lecture',
		];

		for (const table of tables) {
			const { data, error, count } = await supabase
				.from(table)
				.select('*', { count: 'exact', head: true });

			if (error) {
				console.error(`Error accessing ${table}:`, error);
			} else {
				console.log(`✅ ${table}: ${count} records`);
			}
		}

		// Test a simple query
		const { data: reserves, error: reserveError } = await supabase
			.from('reserve')
			.select('*')
			.limit(5);

		if (reserveError) {
			console.error('Reserve query error:', reserveError);
		} else {
			console.log('✅ Sample reserves:', reserves?.length || 0);
		}

		return true;
	} catch (error) {
		console.error('Database connection test failed:', error);
		return false;
	}
}

// Test specific analytics queries
export async function testAnalyticsQueries() {
	try {
		console.log('Testing analytics queries...');

		// Test basic reservation query
		const { data: reservations, error } = await supabase
			.from('reserve')
			.select(
				`
        *,
        profiles!inner(full_name, role)
      `
			)
			.eq('is_submitted', true)
			.limit(10);

		if (error) {
			console.error('Analytics query error:', error);
			return false;
		}

		console.log(
			'✅ Analytics query successful:',
			reservations?.length || 0,
			'records'
		);

		// Test hall query
		const { data: halls, error: hallError } = await supabase
			.from('hall')
			.select('*')
			.limit(5);

		if (hallError) {
			console.error('Hall query error:', hallError);
		} else {
			console.log(
				'✅ Hall query successful:',
				halls?.length || 0,
				'records'
			);
		}

		return true;
	} catch (error) {
		console.error('Analytics queries test failed:', error);
		return false;
	}
}
