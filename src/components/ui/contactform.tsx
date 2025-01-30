'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Contactform = () => {
	const { register, reset, handleSubmit } = useForm();
	const [msg, setMsg] = useState<string>();

	const dataSubmit = (data: unknown) => {
		if (data) {
			setMsg('Thank You for Contacting Us!');
			reset();
		}
	};

	return (
		<form className='mt-5' onSubmit={handleSubmit(dataSubmit)}>
			<div className='flex gap-6 my-3'>
				<div className='w-1/2'>
					<input
						type='text'
						placeholder='First Name'
						className='w-full text-lg py-1.5 rounded shadow-md outline-none'
						{...register('firstName', { required: true })}
					/>
				</div>
				<div className='w-1/2'>
					<input
						type='text'
						placeholder='Last Name'
						className='w-full text-lg py-1.5 rounded shadow-md outline-none'
						{...register('lastName', { required: true })}
					/>
				</div>
			</div>

			<div className='flex gap-6 my-3'>
				<div className='w-1/2'>
					<input
						type='email'
						placeholder='E-Mail'
						className='w-full text-lg py-1.5 rounded shadow-md outline-none'
						{...register('email', { required: true })}
					/>
				</div>
				<div className='w-1/2'>
					<input
						type='tel'
						placeholder='Contact Number'
						className='w-full text-lg py-1.5 rounded shadow-md outline-none'
						{...register('contactnumber')}
					/>
				</div>
			</div>

			<div className='my-3'>
				<textarea
					className='w-full text-lg py-1.5 rounded shadow-md outline-none min-h-32'
					{...register('message')}
					placeholder='Message'
				></textarea>
			</div>
			<div className='flex items-center justify-end mt-6'>
				<p className='text-white font-medium text-lg mr-4'>{msg}</p>
				<button
					type='submit'
					className='bg-white rounded text-black hover:bg-slate-500 transition-all ease-linear py-2 px-3 font-medium uppercase shadow-md hover:shadow-lg hover:scale-105 duration-300 flex 
            items-center justify-center space-x-2'
				>
					Send Message
				</button>
			</div>
		</form>
	);
};

export default Contactform;
