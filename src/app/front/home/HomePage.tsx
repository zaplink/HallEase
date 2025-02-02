import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
	return (
		<div className='min-h-screen bg-gray-50 flex flex-col'>
			<nav className='bg-gradient-to-r from-gray-500 to-white shadow-lg fixed top-0 right-0 w-full z-20'>
				<div className='container mx-auto px-6 py-4 flex justify-end items-center'>
					{/* Navigation Links */}
					<div className='flex space-x-8'>
						<Button
							variant='link'
							className='text-black hover:text-gray-300 text-lg px-4 py-2 italic transition duration-300'
						>
							Home
						</Button>
						<Button
							variant='link'
							className='text-black hover:text-gray-300 text-lg px-4 py-2 italic transition duration-300'
						>
							Users
						</Button>
						<Button
							variant='link'
							className='text-black hover:text-gray-300 text-lg px-4 py-2 italic transition duration-300'
						>
							Public
						</Button>
						<Button
							variant='link'
							className='text-black hover:text-gray-300 text-lg px-4 py-2 italic transition duration-300'
						>
							Contacts
						</Button>
					</div>
				</div>
			</nav>

			<section
				className='relative bg-gray-100 py-16 px-4 flex flex-col items-center justify-center'
				style={{ minHeight: '100vh', paddingTop: '60px' }}
			>
				{/* Background Image Container for HomePage */}
				<div className='absolute inset-0'>
					<div className='relative w-full h-full'>
						<Image
							src='/fct2.jpg' // Make sure the path to this image is correct
							alt='Background image'
							layout='fill'
							objectFit='cover'
							priority={true}
						/>
					</div>
				</div>

				{/* Content Section */}
				<div className='relative z-10 text-center'>
					<Card className='bg-white/75 max-w-3xl mx-auto p-8 rounded-lg shadow-lg border border-gray-200'>
						<CardHeader>
							<CardTitle className='text-4xl font-semibold text-black mb-6 italic underline'>
								About the Faculty
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-lg text-gray-700 leading-relaxed'>
								A realm where imagination meets innovation, and
								possibilities stretch beyond the horizon. Since
								our inception in 2016, we&apos;ve been pioneers
								of technological advancement in Sri Lanka,
								cultivating brilliance and fostering a community
								dedicated to sculpting a sustainable future.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
