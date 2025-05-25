import SidebarLayout from '@/layouts/Sidebar/Layout';

function page() {
	return (
		<SidebarLayout>
			<div className='flex flex-col items-center justify-center h-screen'>
				<h1 className='text-2xl font-bold mb-4'>
					FAQ - Frequently Asked Questions
				</h1>
			</div>
		</SidebarLayout>
	);
}
export default page;
