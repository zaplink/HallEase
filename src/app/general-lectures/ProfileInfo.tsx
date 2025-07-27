// 'use client';

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserData } from '@/redux/authSlice';
// import { RootState, AppDispatch } from '@/redux/store';
// import { createClient } from '@/lib/supabaseClient';

// const ProfileInfo = () => {
// 	const dispatch = useDispatch<AppDispatch>();
// 	const user = useSelector((state: RootState) => state.auth.user);
// 	const [userId, setUserId] = useState<string | null>(null);

// 	useEffect(() => {
// 		dispatch(fetchUserData());

// 		// Fetch and display user ID for debugging
// 		const fetchUserId = async () => {
// 			const supabase = createClient();
// 			const { data: authData, error } = await supabase.auth.getUser();

// 			if (authData?.user?.id) {
// 				setUserId(authData.user.id);
// 			} else {
// 				console.error('Failed to fetch user ID', error);
// 			}
// 		};

// 		fetchUserId();
// 	}, [dispatch]);

// 	return (
// 		<div className='p-6 border rounded-md shadow-md w-80'>
// 			<h2 className='text-lg font-semibold mb-2'>User Profile</h2>
// 			{user ? (
// 				<div>
// 					<p>
// 						<strong>Name:</strong> {user.full_name}
// 					</p>
// 					<p>
// 						<strong>Role:</strong> {user.role}
// 					</p>

// 					<span>{user.permissions.join(', ')}</span>

// 					{user.permissions.includes('MBR') && (
// 						<span className='text-green-600 font-bold'>
// 							You can manage users!
// 						</span>
// 					)}
// 				</div>
// 			) : (
// 				<div>
// 					<p>Loading...</p>
// 					{userId && (
// 						<p className='text-red-500'>User ID: {userId}</p>
// 					)}
// 				</div>
// 			)}
// 		</div>
// 	);
// };

// export default ProfileInfo;
