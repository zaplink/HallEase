'use client';

interface TestEventFormProps {
	onBackToSelection?: () => void;
}

export default function TestEventForm({
	onBackToSelection,
}: TestEventFormProps) {
	return (
		<div className='p-4'>
			<h1>Test Event Form</h1>
			<p>This is a test component to verify imports are working.</p>
			{onBackToSelection && (
				<button
					onClick={onBackToSelection}
					className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
				>
					← Back to Selection
				</button>
			)}
		</div>
	);
}
