import sidebarMenu from '@/layouts/Sidebar/Menu/menu-items';

// Create a type guard function to check if an item has a subMenu property
function hasSubMenu(item: unknown): item is {
	itemTitle: string;
	itemUrl: string;
	subMenu: Array<{ subUrl: string; subTitle: string }>;
} {
	return Boolean(
		item &&
			typeof item === 'object' &&
			'subMenu' in item &&
			Array.isArray((item as Record<string, unknown>).subMenu)
	);
}

export const findBreadcrumb = (path: string) => {
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
			if (hasSubMenu(item)) {
				const subItem = item.subMenu.find(
					(sub: { subUrl: string }) => sub.subUrl === path
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
