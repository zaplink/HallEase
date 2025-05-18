import SidebarLayout from '@/layouts/Sidebar/Layout';
import NotFound from '../not-found';

function page() {
	return (
		<SidebarLayout>
			<NotFound />
		</SidebarLayout>
	);
}

export default page;
