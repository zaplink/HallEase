import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

// Define the Hall type based on your database structure
type Hall = {
	id: number;
	room: string;
	capacity: number;
	type?: string; // Add other fields as needed
};

const useHalls = () => {
	const [halls, setHalls] = useState<Hall[]>([]); // Explicitly type the state
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchHalls = async () => {
			setLoading(true);
			const supabase = createClient();

			try {
				const { data, error } = await supabase
					.from('halls')
					.select('*');
				if (error) throw error;
				setHalls(data as Hall[]); // Explicitly cast the data to `Hall[]`
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchHalls();
	}, []);

	return { halls, loading, error };
};

export default useHalls;
