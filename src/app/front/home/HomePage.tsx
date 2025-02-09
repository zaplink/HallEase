'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const HomePage = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	// Function to track scroll position
	useEffect(() => {
		const handleScroll = () => {
			// Change navbar when scrolled past 100px (adjust as needed)
			if (window.scrollY > 100) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		// Listen for scroll events
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className='min-h-screen flex flex-col'>
			<nav
				className={`fixed top-0 w-full z-20 py-6 transition-all duration-300 ${
					isScrolled
						? 'bg-white/30 backdrop-blur-md shadow-lg'
						: 'bg-transparent'
				}`}
			>
				<div className='container mx-auto px-6 flex justify-center items-center space-x-20'>
					<Button
						variant='outline'
						className='rounded-full px-6 py-5 text-xl font-bold border-2 text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white transition duration-300'
					>
						Home
					</Button>

					<Button
						variant='outline'
						className='rounded-full px-6 py-5 text-lg font-bold border-2 text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white transition duration-300'
					>
						Users
					</Button>

					<Button
						variant='outline'
						className='rounded-full px-6 py-5 text-lg font-bold border-2 text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white transition duration-300'
					>
						Public
					</Button>

					<Button
						variant='outline'
						className='rounded-full px-6 py-5 text-lg font-bold border-2 text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white transition duration-300'
					>
						Contacts
					</Button>
				</div>
			</nav>

			<section className='relative flex flex-col items-center justify-center min-h-screen text-center'>
				{/* background image  */}
				<div className='absolute inset-0'>
					<Image
						src='/fct1.jpg'
						alt='University Hall'
						layout='fill'
						objectFit='cover'
						priority
					/>
				</div>

				{/* empty section  */}
				<div className='w-full h-[45vh]'></div>

				{/* content section  */}
				<div className='flex flex-col flex-grow relative z-10 text-left bg-slate-400/50  py-12 md:px-24 w-full h-full shadow-lg'>
					<h1 className='text-white text-6xl font-bold'>
						Welcome to <br />
						<span className='text-white-400 text-9xl'>
							HallEase{' '}
						</span>
						<span className='text-orange-400 text-9xl'> FCT</span>
					</h1>
					<br />
					<p className='text-white text-2xl mt-4'>
						<span className='font-bold my-10'>
							Seamlessly manage faculty halls with ease.
						</span>
						<br />
						From room allocations to user access, HallEase
						simplifies the process, <br />
						ensuring efficiency and convenience for administrators
						and students alike.
					</p>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
