'use client';

import Image from 'next/image';
import Navbar from './NavBar';

const HomePage = () => {
	return (
		<div className='min-h-screen flex flex-col'>
			<header>
				<Navbar />
			</header>

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
				<div className='w-full h-[40vh] md:h-[45vh]'></div>

				{/* content section  */}
				<div className='flex flex-col flex-grow relative z-10 text-left bg-slate-600/50 px-6 md:px-20 py-10 w-full min-h-[50vh] shadow-lg'>
					<h1 className='text-white text-4xl md:text-6xl sm:text-4xl sm:py-5 font-bold'>
						Welcome to <br />
						<span className='text-white text-6xl md:text-9xl sm:text-7xl'>
							HallEase
						</span>
						<span className='text-orange-400 text-6xl md:text-9xl sm:text-7xl'>
							{' '}
							FCT
						</span>
					</h1>
					<p className='text-white text-lg md:text-2xl mt-4 leading-relaxed'>
						<span className='font-bold'>
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
