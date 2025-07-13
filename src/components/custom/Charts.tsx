'use client';

import React from 'react';

interface PieChartProps {
	data: Array<{
		label: string;
		value: number;
		color: string;
	}>;
	title?: string;
	size?: number;
}

export function PieChart({ data, title, size = 200 }: PieChartProps) {
	const total = data.reduce((sum, item) => sum + item.value, 0);

	if (total === 0) {
		return (
			<div className='flex flex-col items-center'>
				{title && (
					<h3 className='text-lg font-semibold mb-4'>{title}</h3>
				)}
				<div
					className='rounded-full border-4 border-gray-200 flex items-center justify-center'
					style={{ width: size, height: size }}
				>
					<span className='text-gray-500 text-sm'>No data</span>
				</div>
			</div>
		);
	}

	let currentAngle = 0;
	const radius = size / 2 - 20;
	const centerX = size / 2;
	const centerY = size / 2;

	const segments = data.map((item) => {
		const percentage = (item.value / total) * 100;
		const angle = (item.value / total) * 360;

		const startAngle = currentAngle;
		const endAngle = currentAngle + angle;
		currentAngle += angle;

		// Convert angles to radians
		const startAngleRad = (startAngle * Math.PI) / 180;
		const endAngleRad = (endAngle * Math.PI) / 180;

		// Calculate path for SVG arc
		const largeArcFlag = angle > 180 ? 1 : 0;
		const x1 = centerX + radius * Math.cos(startAngleRad);
		const y1 = centerY + radius * Math.sin(startAngleRad);
		const x2 = centerX + radius * Math.cos(endAngleRad);
		const y2 = centerY + radius * Math.sin(endAngleRad);

		const pathData = [
			`M ${centerX} ${centerY}`,
			`L ${x1} ${y1}`,
			`A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
			'Z',
		].join(' ');

		return {
			...item,
			pathData,
			percentage: percentage.toFixed(1),
		};
	});

	return (
		<div className='flex flex-col items-center'>
			{title && <h3 className='text-lg font-semibold mb-4'>{title}</h3>}
			<div className='flex items-center gap-6'>
				<svg width={size} height={size} className='drop-shadow-sm'>
					{segments.map((segment, index) => (
						<path
							key={index}
							d={segment.pathData}
							fill={segment.color}
							stroke='white'
							strokeWidth='2'
							className='hover:opacity-80 transition-opacity cursor-pointer'
						>
							<title>{`${segment.label}: ${segment.value} (${segment.percentage}%)`}</title>
						</path>
					))}
				</svg>
				<div className='space-y-2'>
					{segments.map((segment, index) => (
						<div
							key={index}
							className='flex items-center gap-2 text-sm'
						>
							<div
								className='w-3 h-3 rounded-full'
								style={{ backgroundColor: segment.color }}
							/>
							<span className='font-medium'>{segment.label}</span>
							<span className='text-gray-600'>
								{segment.value} ({segment.percentage}%)
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

interface BarChartProps {
	data: Array<{
		label: string;
		value: number;
		color: string;
	}>;
	title?: string;
	height?: number;
}

export function BarChart({ data, title, height = 200 }: BarChartProps) {
	const maxValue = Math.max(...data.map((item) => item.value));

	if (maxValue === 0) {
		return (
			<div className='flex flex-col'>
				{title && (
					<h3 className='text-lg font-semibold mb-4'>{title}</h3>
				)}
				<div
					className='flex items-center justify-center border border-gray-200 rounded-lg'
					style={{ height }}
				>
					<span className='text-gray-500 text-sm'>No data</span>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col'>
			{title && <h3 className='text-lg font-semibold mb-4'>{title}</h3>}
			<div
				className='flex items-end gap-2 p-4 border border-gray-200 rounded-lg'
				style={{ height }}
			>
				{data.map((item, index) => {
					const barHeight = (item.value / maxValue) * (height - 80);
					return (
						<div
							key={index}
							className='flex flex-col items-center flex-1'
						>
							<div className='text-xs text-gray-600 mb-1'>
								{item.value}
							</div>
							<div
								className='w-full rounded-t-md transition-all hover:opacity-80 cursor-pointer'
								style={{
									backgroundColor: item.color,
									height: barHeight || 2,
									minHeight: '2px',
								}}
								title={`${item.label}: ${item.value}`}
							/>
							<div className='text-xs mt-2 text-center font-medium text-gray-700'>
								{item.label}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

interface LineChartProps {
	data: Array<{
		label: string;
		value: number;
	}>;
	title?: string;
	height?: number;
	color?: string;
}

export function LineChart({
	data,
	title,
	height = 200,
	color = '#3B82F6',
}: LineChartProps) {
	const maxValue = Math.max(...data.map((item) => item.value));
	const minValue = Math.min(...data.map((item) => item.value));

	if (data.length === 0) {
		return (
			<div className='flex flex-col'>
				{title && (
					<h3 className='text-lg font-semibold mb-4'>{title}</h3>
				)}
				<div
					className='flex items-center justify-center border border-gray-200 rounded-lg'
					style={{ height }}
				>
					<span className='text-gray-500 text-sm'>No data</span>
				</div>
			</div>
		);
	}

	const width = 400;
	const padding = 40;
	const chartWidth = width - 2 * padding;
	const chartHeight = height - 2 * padding;

	const points = data.map((item, index) => {
		const x = padding + (index / (data.length - 1)) * chartWidth;
		const y =
			padding +
			((maxValue - item.value) / (maxValue - minValue || 1)) *
				chartHeight;
		return { x, y, ...item };
	});

	const pathData = points
		.map(
			(point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
		)
		.join(' ');

	return (
		<div className='flex flex-col'>
			{title && <h3 className='text-lg font-semibold mb-4'>{title}</h3>}
			<div className='border border-gray-200 rounded-lg p-2'>
				<svg width={width} height={height}>
					{/* Grid lines */}
					<defs>
						<pattern
							id='grid'
							width='40'
							height='40'
							patternUnits='userSpaceOnUse'
						>
							<path
								d='M 40 0 L 0 0 0 40'
								fill='none'
								stroke='#f3f4f6'
								strokeWidth='1'
							/>
						</pattern>
					</defs>
					<rect width='100%' height='100%' fill='url(#grid)' />

					{/* Line */}
					<path
						d={pathData}
						fill='none'
						stroke={color}
						strokeWidth='3'
						className='drop-shadow-sm'
					/>

					{/* Points */}
					{points.map((point, index) => (
						<circle
							key={index}
							cx={point.x}
							cy={point.y}
							r='4'
							fill={color}
							className='hover:r-6 transition-all cursor-pointer drop-shadow-sm'
						>
							<title>{`${point.label}: ${point.value}`}</title>
						</circle>
					))}

					{/* X-axis labels */}
					{points.map((point, index) => (
						<text
							key={index}
							x={point.x}
							y={height - 10}
							textAnchor='middle'
							className='text-xs fill-gray-600'
						>
							{point.label.split('-').slice(1).join('/')}
						</text>
					))}
				</svg>
			</div>
		</div>
	);
}
