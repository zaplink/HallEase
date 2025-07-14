'use client';

import { useEffect, useState } from 'react';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DraftSummary, getRecentDrafts } from './getRecentDrafts';
import Loading from '@/components/custom/Loading';
import { useDraftRefreshListener } from './refreshDrafts';
import ProtectedPage from '@/layouts/ProtectedPage';

export default function ReservePage() {


	const router = useRouter();
	const [drafts, setDrafts] = useState<DraftSummary[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchDrafts = async () => {
		console.log('Reserve page - Fetching drafts...');
		try {
			const recentDrafts = await getRecentDrafts(5); // Get most recent 5 drafts
			console.log('Reserve page - Fetched drafts:', recentDrafts);
			setDrafts(recentDrafts);
		} catch (error) {
			console.error('Failed to fetch drafts:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDrafts();

		// Listen for focus events to refresh when user returns to the page
		const handleFocus = () => {
			fetchDrafts();
		};

		window.addEventListener('focus', handleFocus);

		// Set up an interval to periodically refresh drafts
		const refreshInterval = setInterval(() => {
			fetchDrafts();
		}, 30000); // Refresh every 30 seconds

		// Cleanup on component unmount
		return () => {
			window.removeEventListener('focus', handleFocus);
			clearInterval(refreshInterval);
		};
	}, []);

	// Listen for custom refresh events
	useDraftRefreshListener(fetchDrafts);

	const purposes = [
		{
			id: 'extra-lecture',
			label: 'Extra Lecture',
			description: 'Reserve a hall for your extra lecture',
		},
		{
			id: 'event',
			label: 'Event',
			description: 'Conferences and presentations',
		},
	];

	const handlePurposeSelection = (purposeId: string) => {
		router.push(`/reserve/${purposeId}`);
	};

	const handleEditDraft = (draft: DraftSummary) => {
		// Navigate to the appropriate form based on draft type
		router.push(`/reserve/${draft.type}`);
		// In a real implementation, you would also load the draft data into the form
		console.log('Editing draft:', draft);
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
		<ProtectedPage>

		<SidebarLayout>
			<PageHeader
				title='Reserve a Space'
				descriptions={["Let's get everything set up for you."]}
			/>

			<div className='flex gap-6 h-[calc(100vh-12rem)]'>
				{/* Left Panel - New Reservations */}
				<div className='flex-1 min-w-0 bg-background rounded-lg border border-border p-6'>
					<div className='space-y-4'>
						<div className='text-center space-y-2'>
							<h2 className='text-xl font-semibold text-foreground'>
								Create New Reservation
							</h2>
							<p className='text-sm text-muted-foreground'>
								Select the type of activity for your reservation
							</p>
						</div>

						<div className='pt-8'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto'>
								{purposes.map((purposeOption) => (
									<div
										key={purposeOption.id}
										className='border border-border rounded-lg hover:border-primary/50 transition-colors duration-200'
									>
										<Button
											variant='ghost'
											className='h-auto p-6 w-full flex flex-col items-center text-center space-y-4 hover:bg-muted/50'
											onClick={() =>
												handlePurposeSelection(
													purposeOption.id
												)
											}
										>
											<div className='w-12 h-12 rounded-lg bg-muted flex items-center justify-center'>
												<div className='w-6 h-6 bg-primary/20 rounded'></div>
											</div>
											<div className='space-y-1'>
												<div className='font-medium text-base'>
													{purposeOption.label}
												</div>
												<div className='text-sm text-muted-foreground'>
													{purposeOption.description}
												</div>
											</div>
										</Button>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Right Panel - Saved Drafts */}
				<div className='w-72 bg-muted/20 rounded-lg border border-border p-4'>
					<div className='space-y-4'>
						<div className='pb-2 border-b border-border'>
							<h3 className='text-base font-medium text-foreground'>
								Saved Drafts
							</h3>
							{!loading && (
								<p className='text-xs text-muted-foreground mt-1'>
									{drafts.length} draft
									{drafts.length !== 1 ? 's' : ''} available
								</p>
							)}
						</div>

						<div className='space-y-2'>
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
									View all drafts
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</SidebarLayout>
		</ProtectedPage>
	);
}
