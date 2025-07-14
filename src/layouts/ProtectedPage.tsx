'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function ProtectedPage({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [isAuthChecked, setIsAuthChecked] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const supabase = await createClient();
			const { data, error } = await supabase.auth.getUser();
			if (error || !data?.user) {
				router.replace('/login');
			}
			setIsAuthChecked(true);
		};
		checkAuth();
	}, [router]);

	// Don't show anything while checking auth
	if (!isAuthChecked) return null;

	return children;
}
