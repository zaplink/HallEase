'use client';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import ProtectedPage from '@/layouts/ProtectedPage';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchUserData } from '@/redux/authSlice';
import PageHeader from '@/components/custom/PageHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function EditProfile() {
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [avatarUrl, setAvatarUrl] = useState(
		'https://via.placeholder.com/150/cccccc/ffffff?text=Avatar'
	);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [saving, setSaving] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (user) {
			setName(user.full_name || '');
			setEmail(user.email || '');
			setAvatarUrl(
				user.pro_pic ||
					'https://via.placeholder.com/150/cccccc/ffffff?text=Avatar'
			);
		}
	}, [user]);

	const handlePhotoClick = () => {
		fileInputRef.current?.click();
	};

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAvatarFile(file);
			setAvatarUrl(URL.createObjectURL(file));
		}
	};

	const handleSave = async () => {
		setSaving(true);
		setErrorMsg('');
		setSuccessMsg('');
		const supabase = createClient();
		let uploadedAvatarUrl = user?.pro_pic;

		console.log('Starting save process...');
		console.log('User ID:', user?.id);
		console.log('Avatar file:', avatarFile);

		// Upload new avatar if changed
		if (avatarFile) {
			if (!user) {
				setErrorMsg('User not found.');
				setSaving(false);
				return;
			}

			console.log('Uploading new avatar...');
			const fileExt = avatarFile.name.split('.').pop();
			const filePath = `${user.id}.${fileExt}`;

			console.log('File path:', filePath);

			const { error: uploadError } = await supabase.storage
				.from('avatars')
				.upload(filePath, avatarFile, { upsert: true });

			if (uploadError) {
				console.error('Upload error:', uploadError);
				setErrorMsg('Failed to upload avatar: ' + uploadError.message);
				setSaving(false);
				return;
			}

			const { data } = supabase.storage
				.from('avatars')
				.getPublicUrl(filePath);
			uploadedAvatarUrl = data.publicUrl;
			console.log('New avatar URL:', uploadedAvatarUrl);
		}

		console.log('Updating database...');
		console.log('Data to update:', {
			full_name: name,
			email,
			pro_pic: uploadedAvatarUrl,
		});

		// Update profile in DB
		const { error: updateError, data: updateData } = await supabase
			.from('profiles')
			.update({ full_name: name, email, pro_pic: uploadedAvatarUrl })
			.eq('id', user.id)
			.select();

		console.log('Database update result:', { updateError, updateData });

		if (updateError) {
			console.error('Database update error:', updateError);
			setErrorMsg('Failed to update profile: ' + updateError.message);
		} else {
			console.log('Profile updated successfully!');
			setSuccessMsg('Profile updated!');

			// Wait for Redux to update
			console.log('Refreshing user data...');
			await dispatch(fetchUserData());

			setTimeout(() => {
				console.log('Navigating back to profile...');
				router.push('/profile');
			}, 1000);
		}
		setSaving(false);
	};

	const handleDiscard = () => {
		router.push('/profile');
	};

	// Password change state
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordStep, setPasswordStep] = useState<'verify' | 'set' | null>(
		null
	);
	const [passwordMsg, setPasswordMsg] = useState('');
	const [changingPassword, setChangingPassword] = useState(false);

	const handleVerifyOldPassword = async () => {
		setChangingPassword(true);
		setPasswordMsg('');
		const supabase = createClient();
		const { error } = await supabase.auth.signInWithPassword({
			email: user.email,
			password: oldPassword,
		});
		if (error) {
			setPasswordMsg('Old password is incorrect.');
		} else {
			setPasswordStep('set');
			setPasswordMsg('');
		}
		setChangingPassword(false);
	};

	const handleChangePassword = async () => {
		setChangingPassword(true);
		setPasswordMsg('');
		if (newPassword !== confirmPassword) {
			setPasswordMsg('Passwords do not match.');
			setChangingPassword(false);
			return;
		}
		const supabase = createClient();
		const { error } = await supabase.auth.updateUser({
			password: newPassword,
		});
		if (error) {
			setPasswordMsg('Failed to change password: ' + error.message);
		} else {
			setPasswordMsg('Password changed successfully!');
			setPasswordStep(null);
			setOldPassword('');
			setNewPassword('');
			setConfirmPassword('');
		}
		setChangingPassword(false);
	};

	return (
		<ProtectedPage>
			<SidebarLayout>
				<div>
					<PageHeader title='Edit Profile' />
					<div className='flex flex-col items-start gap-6'>
						<div className='relative'>
							<img
								src={avatarUrl}
								alt='Profile'
								className='w-32 h-32 rounded-full object-cover border cursor-pointer'
								onClick={handlePhotoClick}
								onError={(e) => {
									e.currentTarget.src =
										'https://via.placeholder.com/150/cccccc/ffffff?text=Avatar';
								}}
							/>
							<input
								type='file'
								accept='image/*'
								ref={fileInputRef}
								style={{ display: 'none' }}
								onChange={handlePhotoChange}
							/>
							<div className='text-xs mt-1 text-gray-500'>
								Click photo to change
							</div>
						</div>
						<div>
							<Label className='font-semibold'>Name</Label>
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div>
							<Label className='font-semibold'>Email</Label>
							<Input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						{errorMsg && (
							<div className='text-red-600'>{errorMsg}</div>
						)}
						{successMsg && (
							<div className='text-green-600'>{successMsg}</div>
						)}
						<div className='flex gap-4 mt-4'>
							<Button
								variant='default'
								onClick={handleSave}
								disabled={saving}
							>
								{saving ? 'Saving...' : 'Save Changes'}
							</Button>
							<Button
								variant='outline'
								onClick={handleDiscard}
								disabled={saving}
							>
								Discard Changes
							</Button>
						</div>
					</div>

					{/* Password change form */}
					<div className='mt-8'>
						<PageHeader title='Change Password' />
						<div className='flex flex-col gap-4 w-full max-w-md'>
							{passwordStep !== 'set' && (
								<>
									<Label>Old Password</Label>
									<Input
										type='password'
										value={oldPassword}
										onChange={(e) =>
											setOldPassword(e.target.value)
										}
										disabled={changingPassword}
									/>
									<Button
										variant='default'
										onClick={handleVerifyOldPassword}
										disabled={
											changingPassword || !oldPassword
										}
									>
										{changingPassword
											? 'Checking...'
											: 'Verify'}
									</Button>
								</>
							)}
							{passwordStep === 'set' && (
								<>
									<Label>New Password</Label>
									<Input
										type='password'
										value={newPassword}
										onChange={(e) =>
											setNewPassword(e.target.value)
										}
										disabled={changingPassword}
									/>
									<Label>Confirm New Password</Label>
									<Input
										type='password'
										value={confirmPassword}
										onChange={(e) =>
											setConfirmPassword(e.target.value)
										}
										disabled={changingPassword}
									/>
									<Button
										variant='default'
										onClick={handleChangePassword}
										disabled={
											changingPassword ||
											!newPassword ||
											!confirmPassword
										}
									>
										{changingPassword
											? 'Saving...'
											: 'Change Password'}
									</Button>
								</>
							)}
							{passwordMsg && (
								<div
									className={
										passwordMsg.includes('success')
											? 'text-green-600'
											: 'text-red-600'
									}
								>
									{passwordMsg}
								</div>
							)}
							<div>
								<Link
									href='/lost-password'
									className='text-blue-600 underline text-sm'
								>
									Lost password?
								</Link>
							</div>
						</div>
					</div>
				</div>
			</SidebarLayout>
		</ProtectedPage>
	);
}
