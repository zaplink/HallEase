import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	// Function to track scroll position
	useEffect(() => {
		const handleScroll = () => {
			// Change navbar when scrolled past 100px
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

	// Function to scroll to a specific section smoothly
	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			window.scrollTo({
				top: element.offsetTop - 80, // Adjust for navbar height
				behavior: 'smooth',
			});
		}
	};

	return (
		<nav
			className={`fixed top-0 w-full z-20 py-6 transition-all duration-300 ${
				isScrolled
					? 'bg-white/30 backdrop-blur-md shadow-md'
					: 'bg-transparent'
			}`}
		>
			<div className='container mx-auto px-6 flex justify-center items-center md:gap-20 sm:gap-10'>
				{['home', 'users', 'public', 'contacts'].map((section) => (
					<Button
						key={section}
						variant='outline'
						onClick={() => scrollToSection(section)}
						className='rounded-full px-6 py-5 text-xl font-bold border-2 text-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 active:text-white transition duration-300'
					>
						{section.charAt(0).toUpperCase() + section.slice(1)}
					</Button>
				))}
			</div>
		</nav>
	);
};

export default Navbar;
