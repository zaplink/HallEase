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
	UserPlus,
	ContactRound,
	Lock,
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
				roleSlugs: [],
			},
			{
				itemTitle: 'Calender View',
				itemUrl: '/calender-view',
				itemIcon: CalendarClock,
				roleSlugs: [],
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
				roleSlugs: [],
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
				roleSlugs: [],
			},
			{
				itemTitle: 'Booking Requests',
				itemUrl: '/requests',
				itemIcon: BookOpen,
				roleSlugs: ['MBR'],
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
				itemUrl: '/halls',
				itemIcon: Building2,
				roleSlugs: [],
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
				roleSlugs: [],
			},
			{
				itemTitle: 'Email & SMS Reminders',
				itemUrl: '/remainders',
				itemIcon: Mails,
				roleSlugs: [],
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
				roleSlugs: [],
			},
			{
				itemTitle: 'Analytics',
				itemUrl: '/analytics',
				itemIcon: ChartNoAxesCombined,
				roleSlugs: [],
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
				roleSlugs: [],
			},
			{
				itemTitle: 'Access Control',
				itemUrl: '/access-control',
				itemIcon: UserCog,
				roleSlugs: [],
				subMenu: [
					{
						subTitle: 'User Registration',
						subUrl: '/access-control/register',
						subIcon: UserPlus,
					},

					{
						subTitle: 'User Details',
						subUrl: '/access-control/details',
						subIcon: ContactRound,
					},
				],
			},
			{
				itemTitle: 'Roles & Permissions',
				itemUrl: '/roles-permissions',
				itemIcon: Lock,
				roleSlugs: [],
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
				roleSlugs: [],
			},
			{
				itemTitle: 'Report an Issue',
				itemUrl: '/report-issue',
				itemIcon: Flag,
				roleSlugs: [],
			},
		],
	},
];

export default sidebarMenu;
