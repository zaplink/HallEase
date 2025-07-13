import { createClient } from '@/lib/supabaseClient';

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
