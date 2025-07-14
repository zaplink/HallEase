import {
	LayoutDashboard,
	// CalendarClock,
	Building2,
	FilePlus2,
	Airplay,
	BookOpen,
	// Megaphone,
	// Mails,
	Settings,
	UserCog,
	CircleHelp,
	Flag,
	ChartNoAxesCombined,
	FileChartColumn,
	UserPlus,
	ContactRound,
	Lock,
	Library,
	SquareLibrary,
	Newspaper,
	Bug,
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
	roleSlugs: string[];
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
				itemTitle: 'Analytics',
				itemUrl: '/analytics',
				itemIcon: ChartNoAxesCombined,
				roleSlugs: [],
			},
		],
	},
	{
		sectionTitle: 'Events',
		sectionMenu: [
			{
				itemTitle: 'General Lectures', // changed from 'View Events'
				itemUrl: '/general-lectures',
				itemIcon: Airplay,
				roleSlugs: [],
			},
		],
	},
	{
		sectionTitle: 'Reservations',
		sectionMenu: [
			{
				itemTitle: 'Manage Reservations',
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
				itemTitle: 'Public Reservations',
				itemUrl: '/public-reservations',
				itemIcon: Newspaper,
				roleSlugs: [],
			},
			{
				itemTitle: 'Reserve a Hall',
				itemUrl: '/reserve',
				itemIcon: FilePlus2,
				roleSlugs: [],
			},
			{
				itemTitle: 'Saved Drafts',
				itemUrl: '/reservation-drafts',
				itemIcon: BookOpen,
				roleSlugs: ['MBR'],
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
		sectionTitle: 'Insights',
		sectionMenu: [
			{
				itemTitle: 'Reports',
				itemUrl: '/reports',
				itemIcon: FileChartColumn,
				roleSlugs: [],
				subMenu: [
					{
						subTitle: 'Debug Mode',
						subUrl: '/reports/debug',
						subIcon: Bug,
					},
				],
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
			{
				itemTitle: 'Manage Issues',
				itemUrl: '/admin/issues',
				itemIcon: Flag,
				roleSlugs: ['ADMIN', 'SYSTEM'],
			},
		],
	},
];

export default sidebarMenu;
