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
	PencilRuler,
	Cast,
	Library,
	SquareLibrary,
	CircleDot,
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
		sectionTitle: 'Overview',
		sectionMenu: [
			{
				itemTitle: 'Dashboard',
				itemUrl: '/dashboard',
				itemIcon: LayoutDashboard,
				roleSlugs: [],
			},
			{
				itemTitle: 'Timeline',
				itemUrl: '/timeline',
				itemIcon: CalendarClock,
				roleSlugs: [],
			},
		],
	},
	{
		sectionTitle: 'Events',
		sectionMenu: [
			{
				itemTitle: 'View Events',
				itemUrl: '/events',
				itemIcon: Airplay,
				roleSlugs: [],
			},
		],
	},
	{
		sectionTitle: 'Reservations',
		sectionMenu: [
			{
				itemTitle: 'All Reservations',
				itemUrl: '/all-reservations',
				itemIcon: Library,
				roleSlugs: [],
			},
			{
				itemTitle: 'My Reservations',
				itemUrl: '/my-reservations',
				itemIcon: SquareLibrary,
				roleSlugs: [],
			},
			{
				itemTitle: 'Reserve a Hall',
				itemUrl: '/reserve',
				itemIcon: FilePlus2,
				roleSlugs: [],
			},
			{
				itemTitle: 'Reservation Requests',
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
					{
						subTitle: 'All',
						subUrl: '/requests/all',
						subIcon: CircleDot,
					},
				],
			},
		],
	},
	{
		sectionTitle: 'Spaces',
		sectionMenu: [
			{
				itemTitle: 'Hall Facilities',
				itemUrl: '/halls',
				itemIcon: Building2,
				roleSlugs: [],
			},
		],
	},
	{
		sectionTitle: 'Notifications',
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
		sectionTitle: 'Insights',
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
		sectionTitle: 'Preferences',
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
		sectionTitle: 'Assistance',
		sectionMenu: [
			{
				itemTitle: 'FAQs & Documentation',
				itemUrl: '/faq',
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
