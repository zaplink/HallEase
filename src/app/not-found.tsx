import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center h-screen text-center gap-2'>
			<h2 className='text-4xl font-bold'>HallEase</h2>
			<h1 className='text-2xl font-bold'>404 - Page Not Found</h1>
			<p className='text-gray-500'>
				Sorry, we couldn&apos;t find the page you were looking for.
			</p>
			<Button asChild>
				<Link href='/dashboard'>Return Home</Link>
			</Button>
		</div>
	);
}
