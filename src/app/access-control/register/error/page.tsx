'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ErrorPage() {
	return (
		<Suspense fallback={<LoadingMessage />}>
			<ErrorContent />
		</Suspense>
	);
}

function ErrorContent() {
	const searchParams = useSearchParams();
	const errorMessage =
		searchParams.get('message') ?? 'Something went wrong while logging in.';

	return (
		<main className='flex flex-col items-center justify-center min-h-screen text-center gap-2'>
			<h2 className='text-4xl font-bold'>HallEase</h2>
			<h1 className='text-2xl font-bold'>Registration Error</h1>
			<p className='text-gray-500'>
				{errorMessage
					? decodeURIComponent(errorMessage)
					: 'Something went wrong'}
			</p>
			<Button asChild>
				<Link href='/access-control/register'>Try again</Link>
			</Button>
		</main>
	);
}

function LoadingMessage() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen text-center gap-2'>
			<h2 className='text-4xl font-bold'>HallEase</h2>
			<p className='text-gray-500'>Loading error message...</p>
		</div>
	);
}
