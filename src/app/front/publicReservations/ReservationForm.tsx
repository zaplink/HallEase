import React from 'react';
import { Label } from '@/components/ui/label';

const ReservationForm = () => {
	return (
		<div >
			<div className="bg-white/30 backdrop-blur-md backdrop-opacity-10 p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold text-center mb-4">Reserve the Auditorium</h2>
				<form>
					<input
						type="text"
						name="association"
						placeholder="Association Name"
						className="w-full p-2 mb-3 border rounded bg-white/50 backdrop-blur-sm text-black"
					/>
					<input
						type="text"
						name="name"
						placeholder="Your Name"
						className="w-full p-2 mb-3 border rounded bg-white/50 backdrop-blur-sm text-black"
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						className="w-full p-2 mb-3 border rounded bg-white/50 backdrop-blur-sm text-black"
					/>
					<input
						type="date"
						name="date"
						className="w-full p-2 mb-3 border rounded bg-white/50 backdrop-blur-sm text-black"
					/>
					<input
						type="time"
						name="time"
						className="w-full p-2 mb-3 border rounded bg-white/50 backdrop-blur-sm text-black"
					/>
                    <Label htmlFor="email">Time Duration</Label>

					<div className="flex space-x-2 mb-3">
						<input
							type="number"
							name="duration_hours"
							placeholder="Hours"
							className="w-1/2 p-2 border rounded bg-white/50 backdrop-blur-sm text-black"
						/>
						<input
							type="number"
							name="duration_minutes"
							placeholder="Minutes"
							className="w-1/2 p-2 border rounded bg-white/50 backdrop-blur-sm text-black"
						/>
					</div>
					<textarea
						name="purpose"
						placeholder="Purpose of Reservation"
						className="w-full p-2 mb-3 border rounded bg-white/50 backdrop-blur-sm text-black"
					/>
					<button type="submit" className="w-full bg-black text-white p-2 rounded hover:bg-gray-800">Submit</button>
				</form>
			</div>
		</div>
	);
};

export default ReservationForm;


