'use client';

import {
	Sidebar,
	SidebarContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarHeader,
	SidebarFooter,
	SidebarProvider,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { getBaseUrl } from '@/utils/getBaseUrl';
import Link from 'next/link';
// import { useProfile } from '@/hooks/useProfile';
// import { Skeleton } from '@/components/ui/skeleton';
import LogoutButton from './Menu/LogoutButton';
import { Toaster } from '@/components/ui/sonner';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserData } from '@/redux/authSlice';
// import { RootState, AppDispatch } from '@/redux/store';
import ProfileWidget from './Menu/ProfileWidget';
import PageHeader from './Header/PageHeader';
import MenuContent from './Menu/MenuContent';

type SidebarLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function SidebarLayout({ children }: SidebarLayoutProps) {
	const baseUrl = getBaseUrl();
	// const { profile, loading } = useProfile();

	return (
		// Sidebar placeholder
		<SidebarProvider>
			{/* Sideabar */}
			<Sidebar side='left'>
				<SidebarHeader className='p-1'>
					<SidebarMenu>
						<SidebarMenuItem>
							<Link
								href={baseUrl + '/profile'}
								className='flex flex-row justify-left'
							>
								<SidebarMenuButton className='h-auto p-0 my-2 mx-1'>
									{<ProfileWidget />}
									{/* {getAvatar()} */}
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<Separator />

				<SidebarContent>
					{/* Menu content */}
					<MenuContent />
				</SidebarContent>

				<Separator />

				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								{/* logout button  */}
								<LogoutButton />
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>

			{/* Page */}
			<div className='w-full'>
				{/* Header navigation bar */}
				<PageHeader />

				{/* Put page content here*/}
				<main className='px-4 pt-2 flex flex-col h-full'>
					{children}
				</main>

				{/* Toast message holder */}
				<Toaster />
			</div>
		</SidebarProvider>
	);
}
