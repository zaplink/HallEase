import React from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
							<Label htmlFor='issueType'>
								What seems to be the issue?
							</Label>
							<Select>
								<SelectTrigger className='mt-1'>
									<SelectValue placeholder='Select an issue' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='booking'>
										Booking Problem
									</SelectItem>
									<SelectItem value='technical'>
										Technical Issue
									</SelectItem>
									<SelectItem value='other'>Other</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor='description'>
								Can you tell us more?
							</Label>
							<Textarea
								id='description'
								name='description'
								placeholder="Describe the problem you're facing so we can assist you better."
								rows={4}
								className='mt-1'
							/>
						</div>

						<div>
							<Label htmlFor='screenshot'>
								Add a screenshot (if you have one)
							</Label>
							<Input
								id='screenshot'
								name='screenshot'
								type='file'
								accept='image/*'
								className='mt-1'
							/>
						</div>

						<Button type='submit' className='w-full'>
							Submit Report
						</Button>
					</form>
				</div>
			</div>
		</SidebarLayout>
	);
}

export default ReportIssuePage;
