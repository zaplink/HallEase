import {
	LayoutDashboard,
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
} from 'lucide-react';

export interface SubMenuItem {
	subTitle: string;
	subUrl: string;
	subIcon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface SidebarItem {
	itemTitle: string;
	itemUrl: string;
	itemIcon: React.ComponentType<{ size?: number; className?: string }>;
	subMenu?: SubMenuItem[];
}

export interface SidebarSection {
	sectionTitle: string;
	sectionMenu: SidebarItem[];
}

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

export default sidebarMenu;
