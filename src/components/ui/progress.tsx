'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn(
			'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
			className
		)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className='h-full w-full flex-1 bg-primary transition-all'
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

// import { cn } from '@/lib/utils';

// interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
// 	value?: number;
// 	max?: number;
// }

// const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
// 	({ className, value = 0, max = 100, ...props }, ref) => {
// 		const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

// 		return (
// 			<div
// 				ref={ref}
// 				className={cn(
// 					'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
// 					className
// 				)}
// 				{...props}
// 			>
// 				<div
// 					className='h-full bg-primary transition-all duration-300 ease-in-out'
// 					style={{ width: `${percentage}%` }}
// 				/>
// 			</div>
// 		);
// 	}
// );
// Progress.displayName = 'Progress';

export { Progress };
