'use client';

import {
	LayoutDashboard,
	LogOut,
	ChevronDown,
	ChevronRight,
	CalendarClock,
	Building2,
	CircleCheckBig,
	CircleX,
	CirclePause,
	FilePlus2,
	Airplay,
	BookOpen,
	Megaphone,
	Mails,
	Settings,
	UserCog,
	CircleHelp,
	Flag,
	ChartNoAxesCombined,
	FileChartColumn,
	BotMessageSquare,
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
import { useProfile } from '@/hooks/useProfile';
import {
	Drawer,
	// DrawerClose,
	DrawerContent,
	DrawerDescription,
	// DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
// import { ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const sidebarMenu = [
	{
		sectionTitle: 'Dashboard & Overview',
		sectionMenu: [
			{
				itemTitle: 'Dashboard',
				itemUrl: '/dashboard',
				itemIcon: LayoutDashboard,
			},
			{
				itemTitle: 'Calender View',
				itemUrl: '/calender-view',
				itemIcon: CalendarClock,
			},
		],
	},
	{
		sectionTitle: 'Event Management',
		sectionMenu: [
			{
				itemTitle: 'View Events',
				itemUrl: '/event',
				itemIcon: Airplay,
			},
		],
	},
	{
		sectionTitle: 'Hall & Booking Management',
		sectionMenu: [
			{
				itemTitle: 'Book a Hall',
				itemUrl: '/booking',
				itemIcon: FilePlus2,
			},
			{
				itemTitle: 'Booking Requests',
				itemUrl: '/requests',
				itemIcon: BookOpen,
				subMenu: [
					{
						subTitle: 'Pending',
						subUrl: '/requests/pending',
						subIcon: CirclePause,
					},
					{
						subTitle: 'Approved',
						subUrl: '/requests/approved',
						subIcon: CircleCheckBig,
					},
					{
						subTitle: 'Rejected',
						subUrl: '/requests/rejected',
						subIcon: CircleX,
					},
				],
			},
			{
				itemTitle: 'Hall Facilities',
				itemUrl: '/hall',
				itemIcon: Building2,
			},
		],
	},
	{
		sectionTitle: 'Notifications & Communication',
		sectionMenu: [
			{
				itemTitle: 'Announcements',
				itemUrl: '/announcments',
				itemIcon: Megaphone,
			},
			{
				itemTitle: 'Email & SMS Reminders',
				itemUrl: '/remainders',
				itemIcon: Mails,
			},
		],
	},
	{
		sectionTitle: 'Reports & Analytics',
		sectionMenu: [
			{
				itemTitle: 'Reports',
				itemUrl: '/reports',
				itemIcon: FileChartColumn,
			},
			{
				itemTitle: 'Analytics',
				itemUrl: '/analytics',
				itemIcon: ChartNoAxesCombined,
			},
		],
	},
	{
		sectionTitle: 'Settings & Configurations',
		sectionMenu: [
			{
				itemTitle: 'System Preferences',
				itemUrl: '/system-preferences',
				itemIcon: Settings,
			},
			{
				itemTitle: 'Access Control',
				itemUrl: '/access-control',
				itemIcon: UserCog,
			},
		],
	},
	{
		sectionTitle: 'Help & Support',
		sectionMenu: [
			{
				itemTitle: 'FAQs & Documentation',
				itemUrl: '/documentation',
				itemIcon: CircleHelp,
			},
			{
				itemTitle: 'Report an Issue',
				itemUrl: '/report-issue',
				itemIcon: Flag,
			},
		],
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
	// const [isCalendarVisible, setIsCalendarVisible] = useState(false);
	// const toggleCalendar = () => {
	// 	setIsCalendarVisible((prevState) => !prevState); // Toggle the calendar visibility
	// };

	const formattedDate = date ? format(date, 'dd MMMM yyyy') : '';

	const baseUrl = getBaseUrl();
	// console.log(baseUrl);

	// State to track the currently open submenu
	const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

	// Toggle submenu state
	const toggleSubMenu = (menuTitle: string) => {
		setOpenSubMenu((prev) => (prev === menuTitle ? null : menuTitle));
	};

	const { profile, loading } = useProfile();

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
										{/* <AvatarImage src='https://github.com/shadcn.png' /> */}

										{loading ? (
											<AvatarImage src='https://github.com/shadcn.png' />
										) : profile ? (
											<AvatarImage
												src={profile.pro_pic}
											/>
										) : (
											<AvatarImage src='https://github.com/shadcn.png' />
										)}
										<AvatarFallback>User</AvatarFallback>
									</Avatar>

									{/* <span className='font-bold'>John Doe</span> */}

									{loading ? (
										<span className='font-bold'>
											Loading...
										</span>
									) : profile ? (
										<span className='font-bold'>
											{profile?.full_name}
										</span>
									) : (
										<span className='font-bold'>
											User not found
										</span>
									)}
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
																	className='mr-5'
																/>
																<span>
																	{
																		item.itemTitle
																	}
																</span>
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
																				<a
																					href={
																						baseUrl +
																						subItem.subUrl
																					}
																					className='flex flex-row justify-left'
																				>
																					<subItem.subIcon
																						size={
																							20
																						}
																						className='mr-5'
																					/>
																					<span>
																						{
																							subItem.subTitle
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
														<a
															href={
																baseUrl +
																item.itemUrl
															}
															className='flex flex-row justify-left'
														>
															<item.itemIcon
																size={20}
																className='mr-5'
															/>
															<span>
																{item.itemTitle}
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
					))}
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
				<div className='px-2 pt-2 flex flex-col h-full'>{children}</div>
			</div>
		</SidebarProvider>
	);
}
