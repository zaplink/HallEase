import GeneralLecturesTimetable from './components/GeneralLecturesTimetable';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';

export default function GeneralLecturesPage() {
	return (
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
	);
}
