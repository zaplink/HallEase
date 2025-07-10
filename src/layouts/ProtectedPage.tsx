'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function ProtectedPage({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [isAuthChecked, setIsAuthChecked] = useState(false);

	useEffect(() => {
		const supabase = createClient();

		supabase.auth.getUser().then(({ data, error }) => {
			if (error || !data?.user) {
				router.replace('/login');
			}
			setIsAuthChecked(true);
		});
	}, [router]);

	// Don't show anything while checking auth
	if (!isAuthChecked) return null;

	return children;
}
