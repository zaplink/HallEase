import { createClient } from '@/lib/supabaseClient';
import { Hall as HallType } from './hall';

export async function getHalls(): Promise<HallType[]> {
	const supabase = createClient();

	const { data, error } = await supabase.from('hall').select('*');

	if (error) {
		console.error('Error fetching halls:', error.message);
		return [];
	}

	return (data ?? []) as HallType[];
}
