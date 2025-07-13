import { createClient } from '@/lib/supabaseClient';

export const getHalls = async () => {
	try {
		const supabase = createClient();

		console.log('Fetching halls from database...');
		const { data, error } = await supabase
			.from('hall')
			.select('*')
			.order('code', { ascending: true });

		console.log('Database response:', { data, error });

		if (error) throw new Error(error.message);

		console.log('Successfully fetched halls:', data?.length || 0, 'halls');
		return data;
	} catch (error) {
		console.error('Error fetching halls data:', error);
		return [];
	}
};

export const getHall = async (code: string) => {
	try {
		const supabase = createClient();

		const { data, error } = await supabase
			.from('hall')
			.select('*')
			.eq('code', code)
			.single();

		if (error) throw new Error(error.message);

		return data;
	} catch (error) {
		console.error('Error fetching hall data:', error);
		return null;
	}
};