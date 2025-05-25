import React from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';

function ReportIssuePage() {
	return (
		<SidebarLayout>
			<div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6'>
				<div className='w-full max-w-md bg-white p-6 rounded-2xl shadow-md'>
					<h2 className='text-3xl font-bold text-center text-gray-800 mb-4'>
						We&apos;re Here to Help
					</h2>
					<p className='text-center text-sm text-gray-600 mb-6'>
						Let us know what went wrong and we&apos;ll do our best
						to fix it quickly.
					</p>
					<form className='space-y-5'>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								What seems to be the issue?
							</label>
							<select
								name='issueType'
								className='w-full mt-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								<option>Booking Problem</option>
								<option>Technical Issue</option>
								<option>Other</option>
							</select>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Can you tell us more?
							</label>
							<textarea
								name='description'
								rows={4}
								placeholder="Describe the problem you're facing so we can assist you better."
								className='w-full mt-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
							></textarea>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Add a screenshot (if you have one)
							</label>
							<input
								type='file'
								name='screenshot'
								accept='image/*'
								className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
							/>
						</div>

						<button
							type='submit'
							className='w-full bg-blue-600 text-white py-2 font-semibold rounded-xl hover:bg-blue-700 transition'
						>
							Submit Report
						</button>
					</form>
				</div>
			</div>
		</SidebarLayout>
	);
}

export default ReportIssuePage;
