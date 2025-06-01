'use client';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import ProtectedPage from '../../layouts/ProtectedPage';
import { Hall as HallType } from './hall';
import { columns } from './columns';
import { DataTable } from './data-table';
import { getHalls } from './getHalls';
import { useEffect, useState } from 'react';
// import ProtectedComponent from './ProtectedComponent';
// import { fetchProfile } from '@/lib/fetchProfile';
import Loading from '@/components/custom/Loading';

export default function Hall() {
	const [halls, setHalls] = useState<HallType[] | null>(null);
	// const [profile, setProfile] = useState<{
	// 	full_name: string;
	// 	id: string;
	// } | null>(null);
	// const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchHalls() {
			const data = await getHalls();
			setHalls(data);
		}

		// async function fetchUser() {
		// 	const profileData = await fetchProfile();
		// 	setProfile(profileData);
		// 	// setLoading(false);
		// }

		fetchHalls();
		// fetchUser();
	}, []);

	return (
		// Sidebar layout
		<ProtectedPage>
			<SidebarLayout>
				<div className='container mx-auto'>
					{halls === null ? (
						// <p>Loading halls...</p>
						<Loading reason='Loading Halls' pageView={true} />
					) : (
						<DataTable columns={columns} data={halls} />
					)}
				</div>
			</SidebarLayout>
		</ProtectedPage>
	);
}
