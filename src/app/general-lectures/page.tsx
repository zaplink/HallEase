import GeneralLecturesTimetable from './components/GeneralLecturesTimetable';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import ProtectedPage from '@/layouts/ProtectedPage';

export default function GeneralLecturesPage() {
	return (
		<ProtectedPage>
			<SidebarLayout>
				<PageHeader
					title='General Lectures Timetable'
					descriptions={[
						'View the weekly timetable for general lectures by selecting a hall.',
						'Search for specific courses to see their lecture schedule.',
					]}
				/>
				<GeneralLecturesTimetable />
			</SidebarLayout>
		</ProtectedPage>
	);
}
