import { createClient } from '@/lib/supabaseClient';

export interface UpdateHallData {
	code?: string;
	capacity?: number;
	building?: string;
	description?: string;
	floor?: number;
	type?: string;
	is_available?: boolean;
	energy_consumption?: number;
}

export const updateHall = async (
	hallCode: string,
	updateData: UpdateHallData
) => {
	try {
		const supabase = createClient();

		console.log('Updating hall with code:', hallCode);
		console.log('Update data:', updateData);

		// First, let's try to find the hall by code to ensure it exists
		const { data: existingHall, error: findError } = await supabase
			.from('hall')
			.select('*')
			.eq('code', hallCode)
			.single();

		if (findError) {
			console.error('Error finding hall:', findError);
			throw new Error(
				`Hall with code ${hallCode} not found: ${findError.message}`
			);
		}

		console.log('Found existing hall:', existingHall);

		// Now update using the hall ID instead of code
		const { data, error } = await supabase
			.from('hall')
			.update(updateData)
			.eq('id', existingHall.id)
			.select()
			.single();

		console.log('Supabase update response:', { data, error });

		if (error) {
			console.error('Supabase error:', error);
			throw new Error(error.message);
		}

		if (!data) {
			throw new Error('No data returned from update operation');
		}

		console.log('Successfully updated hall:', data);
		return data;
	} catch (error) {
		console.error('Error updating hall data:', error);
		throw error;
	}
};
