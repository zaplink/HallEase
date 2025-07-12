import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

interface KPICardProps {
	title: string;
	value: string | number;
	change?: number;
	changeLabel?: string;
	icon?: React.ReactNode;
	description?: string;
	trend?: 'up' | 'down' | 'neutral';
}

export function KPICard({
	title,
	value,
	change,
	changeLabel,
	icon,
	description,
	trend,
}: KPICardProps) {
	const getTrendColor = () => {
		if (trend === 'up') return 'text-green-600';
		if (trend === 'down') return 'text-red-600';
		return 'text-gray-600';
	};

	const getTrendIcon = () => {
		if (trend === 'up') return <ArrowUpIcon className='w-4 h-4' />;
		if (trend === 'down') return <ArrowDownIcon className='w-4 h-4' />;
		return <MinusIcon className='w-4 h-4' />;
	};

	return (
		<Card className='hover:shadow-lg transition-shadow duration-200'>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-sm font-medium text-gray-600'>
					{title}
				</CardTitle>
				{icon && <div className='text-gray-400'>{icon}</div>}
			</CardHeader>
			<CardContent className='pt-0'>
				<div className='text-2xl font-bold text-gray-900 mb-1'>
					{value}
				</div>
				{(change !== undefined || changeLabel) && (
					<div
						className={`flex items-center text-sm ${getTrendColor()}`}
					>
						{change !== undefined && (
							<>
								{getTrendIcon()}
								<span className='ml-1'>
									{change > 0 ? '+' : ''}
									{change}%
								</span>
							</>
						)}
						{changeLabel && (
							<span className='ml-1 text-gray-500'>
								{changeLabel}
							</span>
						)}
					</div>
				)}
				{description && (
					<p className='text-xs text-gray-500 mt-1'>{description}</p>
				)}
			</CardContent>
		</Card>
	);
}
