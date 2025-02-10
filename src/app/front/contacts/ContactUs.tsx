import React from 'react';
import Contactform from '@/components/ui/contactform';
import { FaFacebook } from 'react-icons/fa';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';

const ContactUs = () => {
	return (
		<div
			id='contacts'
			style={{
				backgroundImage: "url('/fct3.jpg')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				height: '100vh',
				position: 'absolute',
				left: 0,
				width: '100%',
				zIndex: -1,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
				}}
			>
				<div className='container mx-auto p-20 bg-black bg-opacity-35 rounded'>
					<h2 className='text-6xl font-bold text-white no-3 uppercase'>
						Contact Us...
					</h2>
					<p className='text-sm text-white w-full max-w-[750px]'>
						Have questions or need assistance? We &apos;re here to
						help! Feel free to reach out to us for any inquiries,
						feedback, or support. Our team is always ready to assist
						you with the best solutions. Simply fill out the form
						below or connect with us on social media,We’d love to
						hear from you!
					</p>
					<Contactform />
					<footer className='mt-20 text-center text-white font-semibold text-sm'>
						<div className='flex justify-center gap-5 mb-5'>
							<a
								href='#'
								className=' hover:text-slate-500 transition duration-300'
							>
								<FaFacebook />
							</a>
							<a
								href='#'
								className=' hover:text-slate-500 transition duration-300'
							>
								<FaFacebookMessenger />
							</a>
							<a
								href='#'
								className=' hover:text-slate-500 transition duration-300'
							>
								<FaInstagram />
							</a>
							<a
								href='#'
								className=' hover:text-slate-500 transition duration-300'
							>
								<FaTwitter />
							</a>
						</div>
						Copyright &copy; 2025-All Rights are Reserved.
					</footer>
				</div>
			</div>
		</div>
	);
};

export default ContactUs;
