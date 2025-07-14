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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, ArrowLeft, BarChart3 } from 'lucide-react';
import ProtectedPage from '@/layouts/ProtectedPage';

function ReportIssuePage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		issueType: '',
		title: '',
		description: '',
		screenshot: null as File | null,
	});
	const [fileName, setFileName] = useState('No file chosen');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setFormData((prev) => ({ ...prev, screenshot: file }));
			setFileName(file.name);
		} else {
			setFormData((prev) => ({ ...prev, screenshot: null }));
			setFileName('No file chosen');
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!formData.issueType || !formData.description.trim()) {
			toast.error('Please fill in all required fields');
			return;
		}

		setIsSubmitting(true);

		try {
			const submitFormData = new FormData();
			submitFormData.append('issueType', formData.issueType);
			submitFormData.append('title', formData.title);
			submitFormData.append('description', formData.description);

			if (formData.screenshot) {
				submitFormData.append('screenshot', formData.screenshot);
			}

			const response = await fetch('/api/submit-issue', {
				method: 'POST',
				body: submitFormData,
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to submit issue');
			}

			setIsSubmitted(true);
			toast.success(
				"Issue reported successfully! We'll look into it soon."
			);

			// Reset form
			setFormData({
				issueType: '',
				title: '',
				description: '',
				screenshot: null,
			});
			setFileName('No file chosen');

			// Redirect after a delay
			setTimeout(() => {
				router.push('/dashboard');
			}, 3000);
		} catch (error) {
			console.error('Error submitting issue:', error);
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Failed to submit issue. Please try again.';
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ProtectedPage>

		<SidebarLayout>
			<div className='flex justify-center py-10 px-6 bg-gray-50'>
				<div className='w-full max-w-3xl'>
					{/* Navigation */}
					<div className='flex gap-3 mb-6'>
						<Button
							onClick={() => router.push('/reports')}
							variant='outline'
							size='sm'
						>
							<ArrowLeft className='w-4 h-4 mr-2' />
							Back to Reports
						</Button>
						<Button
							onClick={() => router.push('/reports')}
							variant='outline'
							size='sm'
						>
							<BarChart3 className='w-4 h-4 mr-2' />
							View Reports Center
						</Button>
					</div>

					{isSubmitted ? (
						<div className='text-center'>
							<CheckCircle className='w-16 h-16 text-green-600 mx-auto mb-4' />
							<h2 className='text-2xl font-bold text-gray-800 mb-4'>
								Issue Submitted Successfully!
							</h2>
							<p className='text-gray-600 mb-6'>
								Thank you for reporting this issue. Our team has
								been notified and will investigate promptly.
							</p>
							<p className='text-sm text-gray-500'>
								Redirecting to dashboard in a few seconds...
							</p>
						</div>
					) : (
						<>
							<h2 className='text-2xl font-bold text-gray-800 mb-6'>
								We&apos;re Here to Help
							</h2>
							<p className='text-sm text-gray-600 mb-8'>
								Let us know what went wrong and we&apos;ll do
								our best to fix it quickly.
							</p>
							<form onSubmit={handleSubmit} className='space-y-6'>
								<div>
									<Label htmlFor='issueType'>
										What seems to be the issue? *
									</Label>
									<Select
										value={formData.issueType}
										onValueChange={(value) =>
											handleInputChange(
												'issueType',
												value
											)
										}
									>
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
											<SelectItem value='other'>
												Other
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor='title'>
										Issue Title (Optional)
									</Label>
									<Input
										id='title'
										name='title'
										value={formData.title}
										onChange={(e) =>
											handleInputChange(
												'title',
												e.target.value
											)
										}
										placeholder='Brief title for your issue'
										className='mt-1'
									/>
								</div>

								<div>
									<Label htmlFor='description'>
										Can you tell us more? *
									</Label>
									<Textarea
										id='description'
										name='description'
										value={formData.description}
										onChange={(e) =>
											handleInputChange(
												'description',
												e.target.value
											)
										}
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
										Upload an image to help us understand
										the issue better.
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

								<Button
									type='submit'
									className='w-full'
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Loader2 className='w-4 h-4 mr-2 animate-spin' />
											Submitting Report...
										</>
									) : (
										'Submit Report'
									)}
								</Button>
							</form>
						</>
					)}
				</div>
			</div>
		</SidebarLayout>
		</ProtectedPage>
	);
}

export default ReportIssuePage;
