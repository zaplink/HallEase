'use client';

import React, { useState } from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import { Label } from '@/components/ui/label';
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
	const [fileName, setFileName] = useState('No file chosen');

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		setFileName(file ? file.name : 'No file chosen');
	};

	return (
		<SidebarLayout>
			<div className='flex justify-center py-10 px-6 bg-gray-50'>
				<div className='w-full max-w-3xl'>
					<h2 className='text-2xl font-bold text-gray-800 mb-6'>
						We&apos;re Here to Help
					</h2>
					<p className='text-sm text-gray-600 mb-8'>
						Let us know what went wrong and we&apos;ll do our best
						to fix it quickly.
					</p>
					<form className='space-y-6'>
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
								Add a screenshot (optional)
							</Label>
							<p className='text-sm text-gray-500 mb-2'>
								Upload an image to help us understand the issue
								better.
							</p>
							<div className='flex items-center space-x-4'>
								<label
									htmlFor='screenshot'
									className='cursor-pointer bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm'
								>
									Choose File
								</label>
								<span className='text-sm text-gray-700'>
									{fileName}
								</span>
								<input
									id='screenshot'
									name='screenshot'
									type='file'
									accept='image/*'
									className='hidden'
									onChange={handleFileChange}
								/>
							</div>
							<p className='text-xs text-gray-500 mt-1'>
								Supported formats: JPG, PNG, GIF.
							</p>
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
