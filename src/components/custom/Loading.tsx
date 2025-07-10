'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/custom/Spinner';

interface LoadingProps {
	className?: string;
	reason?: string; // Optional reason for loading
	pageView?: boolean; // Determines if it should have extra margin
	text?: string; // Explicit text to display (defaults to reason if not provided)
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link';
	inline?: boolean; // When true, renders just the spinner without button wrapper
}

export default function Loading({
	className,
	reason = 'Loading drafts',
	pageView,
	text,
	variant = 'secondary',
	inline = false,
}: LoadingProps) {
	const displayText = text || reason;

	// For inline usage (e.g., inside buttons)
	if (inline) {
		return <Spinner size='sm' className={className} />;
	}

	// For standalone usage
	return (
		<div
			className={cn(
				'flex flex-col items-center gap-2',
				pageView && 'mt-20 mx-auto',
				className
			)}
		>
			<Button variant={variant} disabled className='min-w-[150px]'>
				<Spinner size='sm' />
				{displayText}
			</Button>
		</div>
	);
}
