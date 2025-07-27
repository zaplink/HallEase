'use client';

import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function ProfileWidget() {
	const [full_name, setFullName] = useState('');
	const [pro_pic, setProPic] = useState('');
	const [userRole, setUserRole] = useState('');
	const user = useSelector((state: RootState) => state.auth.user);
	useEffect(() => {
		if (user) {
			setFullName(user.full_name || '');
			setProPic(user.pro_pic || '');
			setUserRole(user.role || '');
		}
	}, [user]);
	if (!user) {
		return (
			<div className='flex items-center space-x-3'>
				<Skeleton className='h-10 w-10 rounded-full' />
				<div className='space-y-3'>
					<Skeleton className='h-3 w-[180px]' />
					<Skeleton className='h-3 w-[160px]' />
				</div>
			</div>
		);
	}
	if (user) {
		return (
			<>
				<Avatar className='mr-1'>
					<AvatarImage src={pro_pic} />
					<AvatarFallback>User</AvatarFallback>
				</Avatar>
				<div className='flex flex-col'>
					<span className='font-bold'>{full_name}</span>
					<span className='font-medium text-gray-600'>
						{userRole}
					</span>
				</div>
			</>
		);
	}
	return (
		<div className='flex items-center space-x-3'>
			<Skeleton className='h-10 w-10 rounded-full' />
			<div className='space-y-3'>
				<Skeleton className='h-3 w-[180px]' />
				<Skeleton className='h-3 w-[160px]' />
			</div>
		</div>
	);
}

export default ProfileWidget;
