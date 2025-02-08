import React from 'react';
import ReservationForm from './ReservationForm';

const Reservations = () => {
	return (
		<div className="bg-cover bg-center min-h-screen flex items-center justify-center text-white relative" style={{ backgroundImage: "url('/auditorium.jpg')" }}>
			<div className="flex w-full h-full px-10 py-10 bg-black/50 ">
				<div className="w-2/3 flex flex-col justify-center">
					<h1 className="text-4xl font-bold mb-4">Welcome to our state-of-the-art auditorium</h1>
					<p className="text-lg leading-relaxed">
						Designed to offer an unparalleled experience for all kinds of events! With a seating capacity of 1,000, our venue ensures comfort and accessibility for large audiences. The cutting-edge sound system delivers crystal-clear audio, making every speech, performance, or presentation impactful. To enhance your event experience, our reservation system dynamically displays real-time seat availability, upcoming events, and a countdown timer for your booking slot. Whether it’s a conference, seminar, or cultural show, our auditorium is equipped to provide a seamless and memorable event experience!
					</p>
				</div>
				<div className="w-1/3 flex items-center justify-center">
					<ReservationForm />
				</div>
			</div>
		</div>
	);
};

export default Reservations;