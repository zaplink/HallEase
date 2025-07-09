'use client';

import { useEffect, useState } from 'react';
import ReserveLectureForm from '../forms/lecture/ReserveLectureStepperForm';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import { useRouter } from 'next/navigation';
import { DraftSummary, getRecentDrafts } from '../getRecentDrafts';
import Loading from '@/components/custom/Loading';
import { Button } from '@/components/ui/button';

export default function ExtraLectureReservePage() {
	const router = useRouter();
	const [drafts, setDrafts] = useState<DraftSummary[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchDrafts() {
			try {
				// Get only lecture drafts (filter by type)
				const recentDrafts = await getRecentDrafts(5);
				const lectureDrafts = recentDrafts.filter(
					(draft) => draft.type === 'extra_lecture'
				);
				setDrafts(lectureDrafts);
			} catch (error) {
				console.error('Failed to fetch drafts:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchDrafts();
	}, []);

	const handleBackToSelection = () => {
		router.push('/reserve');
	};

	const handleEditDraft = (draft: DraftSummary) => {
		// Navigate to edit form with draft ID
		console.log('Editing draft:', draft);
		// Here you would load the draft data into the form
	};

	const formatLastModified = (date: Date) => {
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60)
		);

		if (diffInHours < 1) {
			return 'Just now';
		} else if (diffInHours < 24) {
			return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
		} else {
			const diffInDays = Math.floor(diffInHours / 24);
			if (diffInDays === 1) {
				return 'Yesterday';
			} else if (diffInDays < 7) {
				return `${diffInDays} days ago`;
			} else {
				return date.toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric',
				});
			}
		}
	};

	return (
		<SidebarLayout>
			<PageHeader
				title='Reserve Extra Lecture'
				descriptions={['Create a reservation for your extra lecture']}
			/>
			<div className='flex gap-6'>
				<div className='flex-1'>
					<ReserveLectureForm
						onBackToSelection={handleBackToSelection}
					/>
				</div>

				{/* Recent Lecture Drafts Sidebar */}
				<div className='w-72 bg-muted/20 rounded-lg border border-border p-4 self-start sticky top-4'>
					<div className='space-y-4'>
						<div className='pb-2 border-b border-border'>
							<h3 className='text-base font-medium text-foreground'>
								Recent Lecture Drafts
							</h3>
							{!loading && (
								<p className='text-xs text-muted-foreground mt-1'>
									{drafts.length} draft
									{drafts.length !== 1 ? 's' : ''} available
								</p>
							)}
						</div>

						<div className='space-y-2 max-h-[500px] overflow-y-auto'>
							{loading ? (
								<div className='flex justify-center py-8'>
									<Loading text='Loading drafts' />
								</div>
							) : drafts.length > 0 ? (
								drafts.map((draft) => (
									<div
										key={draft.id}
										className='bg-background border border-border rounded p-3 hover:border-primary/50 transition-colors duration-200 cursor-pointer'
										onClick={() => handleEditDraft(draft)}
									>
										<div className='space-y-2'>
											<div className='flex items-start justify-between gap-2'>
												<h4 className='text-sm font-medium text-foreground truncate'>
													{draft.name}
												</h4>
											</div>

											<div className='flex items-center justify-between text-xs'>
												<span className='text-muted-foreground'>
													{formatLastModified(
														draft.lastModified
													)}
												</span>
												<span className='px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs'>
													0%
												</span>
											</div>
										</div>
									</div>
								))
							) : (
								<div className='text-center py-6 text-sm text-muted-foreground'>
									No saved drafts found
								</div>
							)}
						</div>

						{drafts.length > 0 && (
							<div className='pt-2 border-t border-border'>
								<p className='text-xs text-center text-muted-foreground'>
									Click any draft to continue editing
								</p>
							</div>
						)}

						{drafts.length > 0 && (
							<div className='text-center'>
								<Button
									variant='link'
									className='text-xs'
									onClick={() =>
										router.push('/reservation-drafts')
									}
								>
									See All Drafts
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</SidebarLayout>
	);
}
