import sidebarMenu from '@/layouts/Sidebar/Menu/menu-items';
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenuSub,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';
// import { subscribeToNewBookings } from '@/app/reserve/forms/event/reserve.event.service';

// import { useEffect } from 'react';

export default function MenuContent() {
	// Current path of URL
	const currentPath = usePathname();

	// State to track the currently open submenu
	const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

	// Toggle submenu state
	const toggleSubMenu = (menuTitle: string) => {
		setOpenSubMenu((prev) => (prev === menuTitle ? null : menuTitle));
	};

	// const [notification, setNotification] = useState<string | null>(null);
	// Use below for show notificaitons on booking data submission
	// {notification && (
	// 	<div className='notification'>{notification}</div>
	// )}

	// Subscribe to new bookings on component mount
	// useEffect(() => {
	// 	const channel = subscribeToNewBookings((newBooking) => {
	// 		console.log('Booking received:', newBooking);
	// 		setNotification(`New booking received: ${newBooking.name}`);
	// 	});

	// 	// Cleanup on unmount
	// 	return () => {
	// 		channel.unsubscribe();
	// 	};
	// }, []);

	return (
		<>
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
												<CollapsibleTrigger asChild>
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
															{item.itemTitle}
														</span>
														{/* {notification && (
															<Asterisk />
														)} */}

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
										<SidebarMenuItem key={item.itemTitle}>
											<SidebarMenuButton
												asChild
												isActive={
													currentPath == item.itemUrl
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
		</>
	);
}
