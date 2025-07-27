'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RoleIndicator() {
	const [userRole, setUserRole] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchUserRole() {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (user) {
					const { data: profile } = await supabase
						.from('profiles')
						.select('role, full_name')
						.eq('id', user.id)
						.single();

					if (profile) {
						setUserRole(profile.role);
					}
				}
			} catch (error) {
				console.error('Error fetching user role:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchUserRole();
	}, []);

	if (loading) {
		return (
			<Card className='mb-4'>
				<CardContent className='p-4'>
					<p className='text-sm text-muted-foreground'>
						Loading user role...
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='mb-4'>
			<CardHeader className='pb-2'>
				<CardTitle className='text-sm'>Dashboard View</CardTitle>
			</CardHeader>
			<CardContent className='pt-0'>
				<p className='text-sm'>
					Current Role:{' '}
					<span className='font-semibold text-blue-600'>
						{userRole || 'Unknown'}
					</span>
				</p>
				<p className='text-xs text-muted-foreground mt-1'>
					{userRole === 'ADMIN'
						? 'Showing full admin dashboard with KPI cards'
						: 'Showing simplified user dashboard'}
				</p>
			</CardContent>
		</Card>
	);
}
