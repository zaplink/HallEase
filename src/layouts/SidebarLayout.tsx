'use client';

import {
	LayoutDashboard,
	Building2,
	Airplay,
	LogOut,
	ChevronDown,
	ChevronRight,
	UserRoundCog,
	Settings,
	Shield,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import React from 'react';
import { getBaseUrl } from '@/utils/getBaseUrl';
import { logout } from '@/app/login/logoutAction';
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from '@/components/ui/collapsible';
import Link from 'next/link';

// Sidebar menu items: Application
const menuItemsApp = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: 'Hall Management',
		url: '/hall',
		icon: Building2,
	},
	{
		title: 'Event Management',
		url: '/event',
		icon: Airplay,
	},
];

// Sidebar menu items: Settings & Configuration
const menuItemsConf = [
	{
		title: 'User Settings',
		url: '/user-settings',
		icon: UserRoundCog,
		subMenu: [
			{
				title: 'Roles & Permissions',
				url: '/roles-permissions',
				icon: Shield,
			},
		],
	},
	{
		title: 'System Settings',
		url: '/system-settings',
		icon: Settings,
	},
];

type SidebarLayoutProps = {
	children: React.ReactNode;
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
	// Current path of URL
	const currentPath = usePathname();

	// Calender state
	const [date, setDate] = React.useState<Date | undefined>(new Date());
	const [isCalendarVisible, setIsCalendarVisible] = useState(false);
	const toggleCalendar = () => {
		setIsCalendarVisible((prevState) => !prevState); // Toggle the calendar visibility
	};

	const baseUrl = getBaseUrl();
	// console.log(baseUrl);

	// State to track the currently open submenu
	const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

	// Toggle submenu state
	const toggleSubMenu = (menuTitle: string) => {
		setOpenSubMenu((prev) => (prev === menuTitle ? null : menuTitle));
	};

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
								<SidebarMenuButton className='h-auto p-0 m-2'>
									<Avatar className='mr-5'>
										<AvatarImage src='https://github.com/shadcn.png' />
										<AvatarFallback>JD</AvatarFallback>
									</Avatar>

									<span className='font-bold'>John Doe</span>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<Separator />

				{/* Application */}
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Application</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{menuItemsApp.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={currentPath == item.url}
										>
											<a
												href={baseUrl + item.url}
												className='flex flex-row justify-left'
											>
												<item.icon
													size={20}
													className='mr-5'
												/>
												<span>{item.title}</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>

					{/* Settings & Configuration */}
					<SidebarGroup>
						<SidebarGroupLabel>
							Settings & Configuration
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{menuItemsConf.map((item) => {
									if (item.subMenu) {
										const isOpen =
											openSubMenu === item.title;
										return (
											<Collapsible
												className='group/collapsible'
												key={item.title}
												open={isOpen}
											>
												<SidebarMenuItem
													key={item.title}
												>
													<CollapsibleTrigger asChild>
														<SidebarMenuButton
															isActive={
																currentPath ==
																item.url
															}
															onClick={() =>
																toggleSubMenu(
																	item.title
																)
															} // Toggle between open/close
														>
															<item.icon
																size={20}
																className='mr-5'
															/>
															<span>
																{item.title}
															</span>
															{isOpen ? (
																<ChevronDown
																	className='ml-auto'
																	size={16}
																/>
															) : (
																<ChevronRight
																	className='ml-auto'
																	size={16}
																/>
															)}
														</SidebarMenuButton>
													</CollapsibleTrigger>
													<CollapsibleContent>
														<SidebarMenuSub>
															{item.subMenu.map(
																(subItem) => (
																	<SidebarMenuSubItem
																		key={
																			subItem.title
																		}
																	>
																		<SidebarMenuButton
																			asChild
																			isActive={
																				currentPath ==
																				subItem.url
																			}
																		>
																			<a
																				href={
																					baseUrl +
																					subItem.url
																				}
																				className='flex flex-row justify-left'
																			>
																				<subItem.icon
																					size={
																						20
																					}
																					className='mr-5'
																				/>
																				<span>
																					{
																						subItem.title
																					}
																				</span>
																			</a>
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
											<SidebarMenuItem key={item.title}>
												<SidebarMenuButton
													asChild
													isActive={
														currentPath == item.url
													}
												>
													<a
														href={
															baseUrl + item.url
														}
														className='flex flex-row justify-left'
													>
														<item.icon
															size={20}
															className='mr-5'
														/>
														<span>
															{item.title}
														</span>
													</a>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									}
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<Separator />

				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								{/* logout button  */}
								<button
									onClick={async () => {
										await logout(); // Trigger the logoutAction
									}}
									className='flex flex-row justify-left items-center'
								>
									<LogOut
										size={20}
										className='mr-5 text-red-500'
									/>
									<span className='text-red-500'>Logout</span>
								</button>
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
								<BreadcrumbItem>
									<BreadcrumbPage>System</BreadcrumbPage>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>Test</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>

					{/* Calender button */}
					<div>
						<Button
							onClick={toggleCalendar}
							variant='ghost'
							className='p-2'
						>
							<CalendarIcon size={20} />
						</Button>
					</div>
				</div>

				<Separator />

				{/* Calender */}
				<div className='relative w-full'>
					{isCalendarVisible && (
						<Calendar
							mode='single'
							selected={date}
							onSelect={setDate}
							className='rounded-md border absolute bg-white z-10 top-0 right-2'
						/>
					)}
				</div>

				{/* Put page content here*/}
				<div className='px-2 pt-2 flex flex-col h-full'>{children}</div>
			</div>
		</SidebarProvider>
	);
}
