import { usePathname } from 'next/navigation';
import {
	BreadcrumbItem,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';
import { findBreadcrumb } from '../sidebar.config';
import Link from 'next/link';

const Breadcrumbs = () => {
	const currentPath = usePathname();
	const breadcrumbs = findBreadcrumb(currentPath);

	return (
		<>
			{breadcrumbs.map((breadcrumb, index) => (
				<React.Fragment key={breadcrumb.url}>
					{index !== 0 && <BreadcrumbSeparator />}
					<BreadcrumbItem>
						<Link href={breadcrumb.url}>
							<BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
						</Link>
					</BreadcrumbItem>
				</React.Fragment>
			))}
		</>
	);
};

export default Breadcrumbs;
