'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
	const sizeClass = {
		sm: 'h-4 w-4',
		md: 'h-6 w-6',
		lg: 'h-8 w-8',
	};

	return (
		<div
			className={cn(
				'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]',
				sizeClass[size],
				className
			)}
			role='status'
		>
			<span className='sr-only'>Loading...</span>
		</div>
	);
}
