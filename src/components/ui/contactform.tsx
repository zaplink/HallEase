'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from './input';
import { Button } from './button';
import { Textarea } from './textarea';

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
					<Input
						type='text'
						placeholder='First Name'
						className=' bg-white text-black '
						{...register('firstName', { required: true })}
					/>
				</div>
				<div className='w-1/2'>
					<Input
						type='text'
						placeholder='Last Name'
						className=' bg-white text-black '
						{...register('lastName', { required: true })}
					/>
				</div>
			</div>

			<div className='flex gap-6 my-3'>
				<div className='w-1/2'>
					<Input
						type='email'
						placeholder='E-Mail'
						className=' bg-white text-black '
						{...register('email', { required: true })}
					/>
				</div>
				<div className='w-1/2'>
					<Input
						type='tel'
						placeholder='Contact Number'
						className=' bg-white text-black '
						{...register('contactnumber')}
					/>
				</div>
			</div>

			<div className='my-3'>
				<Textarea
					className=' bg-white text-black w-full min-h-[120px] resize'
					{...register('message')}
					placeholder='Message'
				></Textarea>
			</div>
			<div className='flex items-center justify-end mt-6'>
				<p className='text-white font-medium text-lg mr-4'>{msg}</p>
				<Button
					type='submit'
					className='bg-white rounded text-black hover:bg-slate-500 transition-all ease-linear py-2 px-3 font-medium uppercase shadow-md hover:shadow-lg hover:scale-105 duration-300 flex 
            items-center justify-center space-x-2'
				>
					Send Message
				</Button>
			</div>
		</form>
	);
};

export default Contactform;
