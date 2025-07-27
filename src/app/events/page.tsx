import UnderConstruction from '@/components/custom/UnderConstruction';
import ProtectedPage from '@/layouts/ProtectedPage';
import SidebarLayout from '@/layouts/Sidebar/Layout';

export default function EventsPage() {
	return (
		<ProtectedPage>

		<SidebarLayout>
			<UnderConstruction />
		</SidebarLayout>
		</ProtectedPage>
	);
}
