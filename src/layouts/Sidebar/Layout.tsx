'use client';

import {
	ChevronDown,
	ChevronRight,
	BotMessageSquare,
	Calendar as CalendarIcon,
	Asterisk,
} from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarHeader,
	SidebarFooter,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarProvider,
	SidebarTrigger,
	SidebarMenuSub,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { getBaseUrl } from '@/utils/getBaseUrl';
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from '@/components/ui/collapsible';
import Link from 'next/link';
// import { useProfile } from '@/hooks/useProfile';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { format } from 'date-fns';
import sidebarMenu from '@/layouts/Sidebar/menu-items';
// import { Skeleton } from '@/components/ui/skeleton';
import LogoutButton from './LogoutButton';
import { Toaster } from '@/components/ui/sonner';

// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserData } from '@/redux/authSlice';
// import { RootState, AppDispatch } from '@/redux/store';

import ProfileWidget from './ProfileWidget';

import { subscribeToNewBookings } from '@/app/booking/booking.service';

import { useEffect } from 'react';

type SidebarLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function SidebarLayout({ children }: SidebarLayoutProps) {
	const [notification, setNotification] = useState<string | null>(null);
	// Use below for show notificaitons on booking data submission
	// {notification && (
	// 	<div className='notification'>{notification}</div>
	// )}

	// Subscribe to new bookings on component mount
	useEffect(() => {
		const channel = subscribeToNewBookings((newBooking) => {
			console.log('Booking received:', newBooking);
			setNotification(`New booking received: ${newBooking.name}`);
		});

		// Cleanup on unmount
		return () => {
			channel.unsubscribe();
		};
	}, []);

	// Current path of URL
	const currentPath = usePathname();

	// Calender state
	const [date, setDate] = React.useState<Date | undefined>(new Date());

	const formattedDate = date ? format(date, 'dd MMMM yyyy') : '';

	const baseUrl = getBaseUrl();

	// State to track the currently open submenu
	const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

	// Toggle submenu state
	const toggleSubMenu = (menuTitle: string) => {
		setOpenSubMenu((prev) => (prev === menuTitle ? null : menuTitle));
	};

	// const { profile, loading } = useProfile();

	const findBreadcrumb = (path: string) => {
		const breadcrumbs: { title: string; url: string }[] = [];

		for (const section of sidebarMenu) {
			for (const item of section.sectionMenu) {
				// If it's a main menu item
				if (item.itemUrl === path) {
					breadcrumbs.push({
						title: item.itemTitle,
						url: item.itemUrl,
					});
					return breadcrumbs;
				}

				// If it's inside a submenu
				if (item.subMenu) {
					const subItem = item.subMenu.find(
						(sub) => sub.subUrl === path
					);
					if (subItem) {
						breadcrumbs.push(
							{ title: item.itemTitle, url: item.itemUrl }, // Parent
							{ title: subItem.subTitle, url: subItem.subUrl } // Sub-item
						);
						return breadcrumbs;
					}
				}
			}
		}

		// If path isn't found in sidebarMenu, use the last segment as the title
		const pathSegments = path.split('/').filter(Boolean);
		if (pathSegments.length > 0) {
			const formattedTitle = pathSegments[pathSegments.length - 1]
				.replace(/-/g, ' ')
				.replace(/\b\w/g, (char) => char.toUpperCase());

			breadcrumbs.push({ title: formattedTitle, url: path });
		}

		return breadcrumbs;
	};

	const generateBreadcrumbs = () => {
		const breadcrumbs = findBreadcrumb(currentPath);

		return breadcrumbs.map((breadcrumb, index) => (
			<React.Fragment key={breadcrumb.url}>
				{index !== 0 && <BreadcrumbSeparator />}
				<BreadcrumbItem>
					<Link href={breadcrumb.url}>
						<BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
					</Link>
				</BreadcrumbItem>
			</React.Fragment>
		));
	};

	// ---------------- Before adding Redux commented below
	// const getAvatar = () => {
	// 	if (loading)
	// 		return (
	// 			<div className='flex items-center space-x-3'>
	// 				<Skeleton className='h-10 w-10 rounded-full' />
	// 				<div className='space-y-3'>
	// 					<Skeleton className='h-3 w-[180px]' />
	// 					<Skeleton className='h-3 w-[160px]' />
	// 				</div>
	// 			</div>
	// 		);
	// 	if (profile)
	// 		return (
	// 			<>
	// 				<Avatar className='mr-1'>
	// 					<AvatarImage src={profile.pro_pic} />
	// 					<AvatarFallback>User</AvatarFallback>
	// 				</Avatar>
	// 				<span className='font-bold'>{profile?.full_name}</span>
	// 			</>
	// 		);
	// 	return (
	// 		<>
	// 			<Avatar className='mr-1'>
	// 				<AvatarImage src='https://github.com/shadcn.png' />
	// 				<AvatarFallback>Invalid User</AvatarFallback>
	// 			</Avatar>
	// 			<span className='font-bold'>Invalid User</span>
	// 		</>
	// 	);
	// };

	// ---------------- After adding Redux persist commented below
	// ---------------- USed ProfileWidget instead getAvatar
	// ---------------- Some errors occur such as stay in loading
	// ---------------- Changed @/redux/Providers with some similar codes and looked working
	// const dispatch = useDispatch<AppDispatch>();
	// const {
	// 	user,
	// 	loading: userLoading,
	// 	error: userError,
	// } = useSelector((state: RootState) => state.auth);

	// const [full_name, setFullName] = useState('');
	// const [pro_pic, setProPic] = useState('');
	// const [userRole, setUserRole] = useState('');

	// // Fetch user data on mount
	// useEffect(() => {
	// 	dispatch(fetchUserData());
	// }, [dispatch]);

	// // Update state when Redux profile data is available
	// useEffect(() => {
	// 	if (user) {
	// 		setFullName(user.full_name || '');
	// 		setProPic(user.pro_pic || '');
	// 		setUserRole(user.role || '');
	// 	}
	// }, [user]);

	// const getAvatar = () => {
	// 	if (userLoading)
	// 		return (
	// 			<div className='flex items-center space-x-3'>
	// 				<Skeleton className='h-10 w-10 rounded-full' />
	// 				<div className='space-y-3'>
	// 					<Skeleton className='h-3 w-[180px]' />
	// 					<Skeleton className='h-3 w-[160px]' />
	// 				</div>
	// 			</div>
	// 		);

	// 	if (userError)
	// 		return (
	// 			<div className='flex items-center space-x-3'>
	// 				<Skeleton className='h-10 w-10 rounded-full' />
	// 				<div className='space-y-3'>
	// 					<span className='font-bold text-red-500'>Error!</span>
	// 				</div>
	// 			</div>
	// 		);
	// 	if (user)
	// 		return (
	// 			<>
	// 				<Avatar className='mr-1'>
	// 					<AvatarImage src={pro_pic} />
	// 					<AvatarFallback>User</AvatarFallback>
	// 				</Avatar>
	// 				<div className='flex flex-col'>
	// 					<span className='font-bold'>{full_name}</span>
	// 					<span className='font-medium text-gray-600'>
	// 						{userRole}
	// 					</span>
	// 				</div>
	// 			</>
	// 		);
	// 	return (
	// 		<div className='flex items-center space-x-3'>
	// 			<Skeleton className='h-10 w-10 rounded-full' />
	// 			<div className='space-y-3'>
	// 				<Skeleton className='h-3 w-[180px]' />
	// 				<Skeleton className='h-3 w-[160px]' />
	// 			</div>
	// 		</div>
	// 	);
	// };

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
					{sidebarMenu.map((section) => (
						<SidebarGroup key={section.sectionTitle}>
							<SidebarGroupLabel>
								{section.sectionTitle}
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{section.sectionMenu.map((item) => {
										if (item.subMenu) {
											const isOpen =
												openSubMenu === item.itemTitle;
											return (
												<Collapsible
													className='group/collapsible'
													key={item.itemTitle}
													open={isOpen}
												>
													<SidebarMenuItem
														key={item.itemTitle}
													>
														<CollapsibleTrigger
															asChild
														>
															<SidebarMenuButton
																isActive={
																	currentPath ==
																	item.itemUrl
																}
																onClick={() =>
																	toggleSubMenu(
																		item.itemTitle
																	)
																} // Toggle between open/close
															>
																<item.itemIcon
																	size={20}
																	className='mr-1'
																/>
																<span>
																	{
																		item.itemTitle
																	}
																</span>
																{notification && (
																	<Asterisk />
																)}

																{isOpen ? (
																	<ChevronDown
																		className='ml-auto'
																		size={
																			16
																		}
																	/>
																) : (
																	<ChevronRight
																		className='ml-auto'
																		size={
																			16
																		}
																	/>
																)}
															</SidebarMenuButton>
														</CollapsibleTrigger>
														<CollapsibleContent>
															<SidebarMenuSub>
																{item.subMenu.map(
																	(
																		subItem
																	) => (
																		<SidebarMenuSubItem
																			key={
																				subItem.subTitle
																			}
																		>
																			<SidebarMenuButton
																				asChild
																				isActive={
																					currentPath ==
																					subItem.subUrl
																				}
																			>
																				<Link
																					href={
																						subItem.subUrl
																					}
																					className='flex flex-row justify-left'
																				>
																					<subItem.subIcon
																						size={
																							20
																						}
																						className='mr-1'
																					/>
																					<span>
																						{
																							subItem.subTitle
																						}
																					</span>
																				</Link>
																			</SidebarMenuButton>
																		</SidebarMenuSubItem>
																	)
																)}
															</SidebarMenuSub>
														</CollapsibleContent>
													</SidebarMenuItem>
												</Collapsible>
											);
										} else {
											return (
												<SidebarMenuItem
													key={item.itemTitle}
												>
													<SidebarMenuButton
														asChild
														isActive={
															currentPath ==
															item.itemUrl
														}
													>
														<Link
															href={item.itemUrl}
															className='flex flex-row justify-left'
														>
															<item.itemIcon
																size={20}
																className='mr-1'
															/>
															<span>
																{item.itemTitle}
															</span>
														</Link>
													</SidebarMenuButton>
												</SidebarMenuItem>
											);
										}
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					))}
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
				<div className='w-full pt-3 pb-4 px-4 flex flex-row items- justify-between'>
					<div className='flex flex-row items-center'>
						{/* Sidebar button */}
						<SidebarTrigger />

						{/* Separator */}
						<Separator
							orientation='vertical'
							className='h-5 mx-6'
						/>

						{/* Beadcrumb */}
						<Breadcrumb>
							<BreadcrumbList>
								{generateBreadcrumbs()}
							</BreadcrumbList>
						</Breadcrumb>
					</div>

					<div className='flex flex-row gap-1'>
						{/* Bot button */}
						<Button
							// onClick={toggleCalendar}
							variant='ghost'
							className='p-2'
						>
							<BotMessageSquare size={20} />
						</Button>

						{/* Calender */}
						<Drawer>
							<DrawerTrigger asChild>
								<Button
									// onClick={toggleCalendar}
									variant='ghost'
									className='p-2'
								>
									<CalendarIcon size={20} />
								</Button>
							</DrawerTrigger>
							<DrawerContent>
								<div className='mx-auto w-full max-w-sm'>
									<DrawerHeader>
										<DrawerTitle>
											{formattedDate}
										</DrawerTitle>
										<DrawerDescription>
											Have a Good Day
										</DrawerDescription>
									</DrawerHeader>
									<div className='flex'>
										<Calendar
											mode='single'
											selected={date}
											onSelect={setDate}
											className='rounded-md border bg-white'
										/>
									</div>
								</div>
							</DrawerContent>
						</Drawer>
					</div>
				</div>

				<Separator />

				{/* Put page content here*/}
				<main className='px-4 pt-2 flex flex-col h-full'>
					{children}
				</main>
				<Toaster />
			</div>
		</SidebarProvider>
	);
}
