import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
	return (
		<div className='min-h-screen flex flex-col'>
			<nav className='fixed top-0 w-full z-20 py-5'>
				<div className='container mx-auto px-6 flex justify-center items-center space-x-20'>
					<Button
						variant='outline'
						className='rounded-full px-6 py-2 text-lg font-bold border-2 text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white transition duration-300'
					>
						Home
					</Button>

					<Button
						variant='outline'
						className='rounded-full px-6 py-2 text-lg font-bold border-2 text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white transition duration-300'
					>
						Users
					</Button>

					<Button
						variant='outline'
						className='rounded-full px-6 py-2 text-lg font-bold border-2 text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white transition duration-300'
					>
						Public
					</Button>

					<Button
						variant='outline'
						className='rounded-full px-6 py-2 text-lg font-bold border-2 text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white transition duration-300'
					>
						Contacts
					</Button>
				</div>
			</nav>

			<section className='relative flex flex-col items-center justify-center min-h-screen text-center'>
				<div className='absolute inset-0'>
					<Image
						src='/fct1.jpg'
						alt='University Hall'
						layout='fill'
						objectFit='cover'
						priority
					/>
				</div>
				<div className='relative z-10 w-full px-4'>
					<Card className='bg-white/80 max-w-2xl mx-auto p-8 rounded-2xl shadow-lg'>
						<CardHeader>
							<CardTitle className='text-5xl font-bold text-gray-900'>
								HallEase{' '}
								<span className='text-orange-500'>FCT</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-lg text-gray-700'>
								Seamlessly manage university halls with ease.
								Simplifying hall management for admins and
								students.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
