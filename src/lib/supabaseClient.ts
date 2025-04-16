// For client-side authenticated actions
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}

// Use 'supabase' instead of 'createClient()' as a standard.
export const supabase = createClient();
