import sidebarMenu from '@/layouts/Sidebar/Menu/menu-items';

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
			if (item.subMenu) {
				const subItem = item.subMenu.find((sub) => sub.subUrl === path);
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
