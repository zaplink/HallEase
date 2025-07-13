// 'use client';

// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import SidebarLayout from '@/layouts/Sidebar/Layout';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import ProtectedPage from '@/layouts/ProtectedPage';
// import { RootState, AppDispatch } from '@/redux/store';
// import { fetchUserData } from '@/redux/authSlice';
// import PageHeader from '@/components/custom/PageHeader';
// import Loading from '@/components/custom/Loading';

// export default function Profile() {
// 	const dispatch = useDispatch<AppDispatch>();

// 	// Redux state
// 	const { user, loading, error } = useSelector(
// 		(state: RootState) => state.auth
// 	);

// 	// State for form fields
// 	const [name, setName] = useState('');
// 	const [email, setEmail] = useState('');
// 	const [oldPassword, setOldPassword] = useState('');
// 	const [newPassword, setNewPassword] = useState('');
// 	const [confirmPassword, setConfirmPassword] = useState('');

// 	// Fetch user data on mount
// 	useEffect(() => {
// 		dispatch(fetchUserData());
// 	}, [dispatch]);

// 	// Update state when Redux profile data is available
// 	useEffect(() => {
// 		if (user) {
// 			setName(user.full_name || '');
// 			setEmail(user.email || '');
// 		}
// 	}, [user]);

// 	// Handle profile update (dummy function)
// 	const handleProfileUpdate = () => {
// 		console.log('Updating profile:', { name, email });
// 		// Add API call here if needed
// 	};

// 	// Handle password change (dummy function)
// 	const handleChangePassword = () => {
// 		console.log('Changing password:', {
// 			oldPassword,
// 			newPassword,
// 			confirmPassword,
// 		});
// 		// Add API call here if needed
// 	};

// 	return (
// 		<ProtectedPage>
// 			<SidebarLayout>
// 				<div>
// 					{/* Profile Section */}
// 					<div className='mb-12'>
// 						<PageHeader title='Profile Information' />

// 						{loading && <Loading />}
// 						{error && <p className='text-red-500'>{error}</p>}

// 						{!loading && !error && user && (
// 							<>
// 								<div className='mb-6'>
// 									<Label className='font-semibold mb-1'>
// 										Name
// 									</Label>
// 									<Input
// 										value={name}
// 										onChange={(e) =>
// 											setName(e.target.value)
// 										}
// 										className='w-2/5'
// 									/>
// 								</div>

// 								<div className='my-6'>
// 									<Label className='font-semibold mb-1'>
// 										Email
// 									</Label>
// 									<Input
// 										value={email}
// 										onChange={(e) =>
// 											setEmail(e.target.value)
// 										}
// 										className='w-2/5'
// 									/>
// 								</div>

// 								<div className='my-6'>
// 									<Button
// 										variant='default'
// 										onClick={handleProfileUpdate}
// 									>
// 										Update Profile
// 									</Button>
// 								</div>
// 							</>
// 						)}
// 					</div>

// 					{/* Password Section */}
// 					<div className='mb-12'>
// 						<PageHeader title='Password & Authentication' />

// 						<div className='my-6'>
// 							<Label className='font-semibold mb-1'>
// 								Old Password
// 							</Label>
// 							<Input
// 								type='password'
// 								value={oldPassword}
// 								onChange={(e) => setOldPassword(e.target.value)}
// 								className='w-2/5'
// 							/>
// 						</div>

// 						<div className='my-6'>
// 							<Label className='font-semibold mb-1'>
// 								New Password
// 							</Label>
// 							<Input
// 								type='password'
// 								value={newPassword}
// 								onChange={(e) => setNewPassword(e.target.value)}
// 								className='w-2/5'
// 							/>
// 						</div>

// 						<div className='my-6'>
// 							<Label className='font-semibold mb-1'>
// 								Re-enter New Password
// 							</Label>
// 							<Input
// 								type='password'
// 								value={confirmPassword}
// 								onChange={(e) =>
// 									setConfirmPassword(e.target.value)
// 								}
// 								className='w-2/5'
// 							/>
// 						</div>

// 						<div className='my-6'>
// 							<Button
// 								variant='default'
// 								onClick={handleChangePassword}
// 							>
// 								Change Password
// 							</Button>
// 						</div>
// 					</div>

// 					{/* Activities Section */}
// 					<div className='mb-12'>
// 						<PageHeader title='Activities' />

// 						<div className='my-6 flex flex-col'>
// 							<Label className='font-semibold mb-1'>
// 								Profile Creation
// 							</Label>
// 							<Label className='font-base my-1 italic'>
// 								YYYY-MM-DD HH:MM
// 							</Label>
// 						</div>
// 						<div className='my-6 flex flex-col'>
// 							<Label className='font-semibold mb-1'>
// 								Last Sign In
// 							</Label>
// 							<Label className='font-base my-1 italic'>
// 								YYYY-MM-DD HH:MM
// 							</Label>
// 						</div>
// 					</div>
// 				</div>
// 			</SidebarLayout>
// 		</ProtectedPage>
// 	);
// }

'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import ProtectedPage from '@/layouts/ProtectedPage';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchUserData } from '@/redux/authSlice';
import PageHeader from '@/components/custom/PageHeader';
import Loading from '@/components/custom/Loading';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Profile() {
	const { user, loading, error } = useSelector(
		(state: RootState) => state.auth
	);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const [imageError, setImageError] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		console.log('Profile page loaded, fetching user data...');
		dispatch(fetchUserData());
	}, [dispatch]);

	console.log('Current user in profile:', user);
	console.log('Profile picture URL:', user?.pro_pic);

	const getImageSrc = () => {
		if (!user?.pro_pic || user.pro_pic.trim() === '') {
			console.log('No profile picture URL, using placeholder');
			return 'https://via.placeholder.com/150/cccccc/ffffff?text=Avatar';
		}

		// Log the original URL for debugging
		console.log('Original pro_pic URL:', user.pro_pic);

		// Only add cache busting if the URL doesn't already have one
		// This prevents constant reloading and gives time for Supabase to update
		if (!user.pro_pic.includes('t=')) {
			const separator = user.pro_pic.includes('?') ? '&' : '?';
			const finalUrl = `${user.pro_pic}${separator}t=${Math.floor(Date.now() / 60000)}`; // Update every minute instead of every millisecond
			console.log('Final image URL with cache busting:', finalUrl);
			return finalUrl;
		}

		return user.pro_pic;
	};

	// Test if the image URL is accessible
	const testImageUrl = (url: string) => {
		console.log('Testing image URL:', url);
		const img = new Image();
		img.onload = () => console.log('✅ Image loaded successfully');
		img.onerror = (e) => console.log('❌ Image failed to load:', e);
		img.src = url;
	};

	// Reset image states when user data changes
	useEffect(() => {
		if (user?.pro_pic) {
			setImageError(false);
			setImageLoading(true);
			setRetryCount(0);
		}
	}, [user?.pro_pic]);

	const handleImageLoad = () => {
		console.log('✅ Profile image loaded successfully');
		setImageLoading(false);
		setImageError(false);
	};

	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		console.log('❌ Image failed to load, attempt:', retryCount + 1);

		if (
			retryCount < 2 &&
			user?.pro_pic &&
			!user.pro_pic.includes('placeholder')
		) {
			// Retry loading the original URL without cache busting
			setTimeout(() => {
				setRetryCount((prev) => prev + 1);
				e.currentTarget.src = user.pro_pic + `?retry=${retryCount + 1}`;
			}, 1000);
		} else {
			// Fall back to placeholder after retries
			console.log('Using placeholder after retries');
			setImageError(true);
			setImageLoading(false);
			e.currentTarget.src =
				'https://via.placeholder.com/150/cccccc/ffffff?text=Avatar';
		}
	};

	return (
		<ProtectedPage>
			<SidebarLayout>
				<div>
					<PageHeader title='Profile' />
					{loading && <Loading />}
					{error && <p className='text-red-500'>{error}</p>}
					{!loading && !error && user && (
						<div className='flex flex-col items-start gap-6'>
							<div className='relative group'>
								{imageLoading && !imageError && (
									<div className='absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full z-10'>
										<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
									</div>
								)}
								<img
									src={getImageSrc()}
									alt='Profile'
									className='w-32 h-32 rounded-full object-cover border hover:opacity-80 transition-opacity'
									onLoad={handleImageLoad}
									onError={handleImageError}
								/>
								{/* Quick upload button overlay */}
								<button
									onClick={() => router.push('/profile/edit')}
									className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 z-20'
								>
									<span className='text-white text-sm font-medium'>
										📷 Change Photo
									</span>
								</button>
							</div>
							<div>
								<Label className='font-semibold'>Name</Label>
								<div>{user.full_name || 'No name'}</div>
							</div>
							<div>
								<Label className='font-semibold'>Email</Label>
								<div>{user.email || 'No email'}</div>
							</div>
							<div>
								<Label className='font-semibold'>Role</Label>
								<div>{user.role || 'No role'}</div>
							</div>
							<div className='flex gap-3'>
								<Button
									variant='default'
									onClick={() => router.push('/profile/edit')}
								>
									Update Profile
								</Button>
								{imageError && (
									<Button
										variant='outline'
										onClick={() => {
											setImageError(false);
											setImageLoading(true);
											setRetryCount(0);
											// Force re-fetch user data to get latest image URL
											dispatch(fetchUserData());
										}}
										className='flex items-center gap-2 text-orange-600 border-orange-600'
									>
										🔄 Refresh Photo
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			</SidebarLayout>
		</ProtectedPage>
	);
}
