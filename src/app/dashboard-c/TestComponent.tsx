'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function TestComponent() {
	const { user, loading, error } = useSelector(
		(state: RootState) => state.auth
	);

	if (loading) return <p>Loading user data...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!user) return <p>No user data found.</p>;

	console.log('User Data from Redux:', user);

	return (
		<div>
			<h2>Welcome, {user.full_name}!</h2>
			{/* <img src={user.pro_pic} alt='Profile' width={100} height={100} /> */}
			<p>Email: {user.email}</p>
			<p>Role: {user.role}</p>
			<p>Permissions: {user.permissions.join(', ')}</p>
		</div>
	);
}
