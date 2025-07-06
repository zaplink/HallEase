'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

// Form schema with all steps
const formSchema = z.object({
	// Step 1: Personal Information
	firstName: z.string().min(2, 'First name must be at least 2 characters'),
	lastName: z.string().min(2, 'Last name must be at least 2 characters'),
	email: z.string().email('Please enter a valid email address'),

	// Step 2: Address Information
	address: z.string().min(5, 'Address must be at least 5 characters'),
	city: z.string().min(2, 'City must be at least 2 characters'),
	postalCode: z.string().min(5, 'Postal code must be at least 5 characters'),

	// Step 3: Preferences
	notifications: z.boolean().default(false),
	newsletter: z.boolean().default(false),
	marketing: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

type Step = {
	id: string;
	title: string;
	description: string;
};

const steps: Step[] = [
	{
		id: 'personal',
		title: 'Personal Information',
		description: 'Tell us about yourself',
	},
	{
		id: 'address',
		title: 'Address',
		description: 'Where can we reach you?',
	},
	{
		id: 'preferences',
		title: 'Preferences',
		description: 'Customize your experience',
	},
	{
		id: 'review',
		title: 'Review',
		description: 'Confirm your information',
	},
];

function Stepper({
	currentStep,
	steps,
}: {
	currentStep: number;
	steps: Step[];
}) {
	return (
		<div className='w-full py-6'>
			<div className='flex items-center justify-between w-full'>
				{steps.map((step, index) => (
					<React.Fragment key={step.id}>
						<div className='flex flex-col items-center'>
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
									index < currentStep
										? 'border-primary bg-primary text-primary-foreground'
										: index === currentStep
											? 'border-primary bg-background text-primary'
											: 'border-muted-foreground/25 bg-background text-muted-foreground'
								}`}
							>
								{index < currentStep ? (
									<Check className='h-5 w-5' />
								) : (
									<span className='text-sm font-medium'>
										{index + 1}
									</span>
								)}
							</div>
							<div className='mt-2 text-center max-w-[160px]'>
								<p className='text-sm font-medium'>
									{step.title}
								</p>
								<p className='text-xs text-muted-foreground'>
									{step.description}
								</p>
							</div>
						</div>
						{index < steps.length - 1 && (
							<div className='flex-1 mx-4'>
								<Separator
									className={`h-px w-full ${index < currentStep ? 'bg-primary' : 'bg-muted-foreground/25'}`}
								/>
							</div>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}

function PersonalInfoStep({ form }: { form: UseFormReturn<FormData> }) {
	return (
		<div className='space-y-4'>
			<div className='grid grid-cols-2 gap-4'>
				<FormField
					control={form.control}
					name='firstName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input placeholder='John' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='lastName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input placeholder='Doe' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<FormField
				control={form.control}
				name='email'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input
								placeholder='john.doe@example.com'
								type='email'
								{...field}
							/>
						</FormControl>
						<FormDescription>
							We will use this email to send you updates about
							your account.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}

function AddressStep({ form }: { form: UseFormReturn<FormData> }) {
	return (
		<div className='space-y-4'>
			<FormField
				control={form.control}
				name='address'
				render={({ field }) => (
					<FormItem>
						<FormLabel>Street Address</FormLabel>
						<FormControl>
							<Input placeholder='123 Main Street' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className='grid grid-cols-2 gap-4'>
				<FormField
					control={form.control}
					name='city'
					render={({ field }) => (
						<FormItem>
							<FormLabel>City</FormLabel>
							<FormControl>
								<Input placeholder='New York' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='postalCode'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Postal Code</FormLabel>
							<FormControl>
								<Input placeholder='10001' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}

function PreferencesStep({ form }: { form: UseFormReturn<FormData> }) {
	return (
		<div className='space-y-6'>
			<div>
				<h3 className='text-lg font-medium'>
					Communication Preferences
				</h3>
				<p className='text-sm text-muted-foreground'>
					Choose how you&apos;d like to hear from us.
				</p>
			</div>
			<div className='space-y-4'>
				<FormField
					control={form.control}
					name='notifications'
					render={({ field }) => (
						<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className='space-y-1 leading-none'>
								<FormLabel>Push Notifications</FormLabel>
								<FormDescription>
									Receive notifications about account activity
									and updates.
								</FormDescription>
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='newsletter'
					render={({ field }) => (
						<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className='space-y-1 leading-none'>
								<FormLabel>Newsletter</FormLabel>
								<FormDescription>
									Get our weekly newsletter with product
									updates and tips.
								</FormDescription>
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='marketing'
					render={({ field }) => (
						<FormItem className='flex flex-row items-start space-x-3 space-y-0'>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className='space-y-1 leading-none'>
								<FormLabel>Marketing Emails</FormLabel>
								<FormDescription>
									Receive emails about new features and
									special offers.
								</FormDescription>
							</div>
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}

function ReviewStep({ form }: { form: UseFormReturn<FormData> }) {
	const values = form.getValues();

	return (
		<div className='space-y-6'>
			{' '}
			<div>
				<h3 className='text-lg font-medium'>Review Your Information</h3>
				<p className='text-sm text-muted-foreground'>
					Please review your information before submitting.
				</p>
			</div>
			<div className='space-y-4'>
				<div>
					<h4 className='font-medium text-sm text-muted-foreground uppercase tracking-wide'>
						Personal Information
					</h4>
					<div className='mt-2 space-y-1'>
						<p>
							<span className='font-medium'>Name:</span>{' '}
							{values.firstName} {values.lastName}
						</p>
						<p>
							<span className='font-medium'>Email:</span>{' '}
							{values.email}
						</p>
					</div>
				</div>

				<Separator />

				<div>
					<h4 className='font-medium text-sm text-muted-foreground uppercase tracking-wide'>
						Address
					</h4>
					<div className='mt-2 space-y-1'>
						<p>
							<span className='font-medium'>Address:</span>{' '}
							{values.address}
						</p>
						<p>
							<span className='font-medium'>City:</span>{' '}
							{values.city}
						</p>
						<p>
							<span className='font-medium'>Postal Code:</span>{' '}
							{values.postalCode}
						</p>
					</div>
				</div>

				<Separator />

				<div>
					<h4 className='font-medium text-sm text-muted-foreground uppercase tracking-wide'>
						Preferences
					</h4>
					<div className='mt-2 space-y-1'>
						<p>
							<span className='font-medium'>
								Push Notifications:
							</span>{' '}
							{values.notifications ? 'Yes' : 'No'}
						</p>
						<p>
							<span className='font-medium'>Newsletter:</span>{' '}
							{values.newsletter ? 'Yes' : 'No'}
						</p>
						<p>
							<span className='font-medium'>
								Marketing Emails:
							</span>{' '}
							{values.marketing ? 'Yes' : 'No'}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function StepperForm() {
	const [currentStep, setCurrentStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			address: '',
			city: '',
			postalCode: '',
			notifications: false,
			newsletter: false,
			marketing: false,
		},
	});

	const validateCurrentStep = async () => {
		const fieldsToValidate = getFieldsForStep(currentStep);
		const isValid = await form.trigger(fieldsToValidate);
		return isValid;
	};

	const getFieldsForStep = (step: number): (keyof FormData)[] => {
		switch (step) {
			case 0:
				return ['firstName', 'lastName', 'email'];
			case 1:
				return ['address', 'city', 'postalCode'];
			case 2:
				return ['notifications', 'newsletter', 'marketing'];
			default:
				return [];
		}
	};

	const nextStep = async () => {
		const isValid = await validateCurrentStep();
		if (isValid && currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));
		console.log('Form submitted:', data);
		alert('Form submitted successfully!');
		setIsSubmitting(false);
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 0:
				return <PersonalInfoStep form={form} />;
			case 1:
				return <AddressStep form={form} />;
			case 2:
				return <PreferencesStep form={form} />;
			case 3:
				return <ReviewStep form={form} />;
			default:
				return null;
		}
	};

	return (
		<div className='w-full mx-auto'>
			<Card className='min-h-[calc(100vh-180px)] relative'>
				{/* <CardHeader>
					<CardTitle>Account Setup</CardTitle>
					<CardDescription>
						Complete your profile in a few simple steps
					</CardDescription>
				</CardHeader> */}
				<CardContent className='h-full flex flex-col pb-20'>
					<Stepper currentStep={currentStep} steps={steps} />

					<Separator className='mt-2 mb-6' />

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='w-full flex-1 flex flex-col'
						>
							<div className='flex-1'>{renderStepContent()}</div>
						</form>
					</Form>

					<div className='absolute bottom-6 left-6 right-6 flex justify-between'>
						<Button
							type='button'
							variant='outline'
							onClick={prevStep}
							disabled={currentStep === 0}
							className='flex items-center gap-2 bg-transparent'
						>
							<ChevronLeft className='h-4 w-4' />
							Previous
						</Button>

						{currentStep === steps.length - 1 ? (
							<Button
								type='submit'
								disabled={isSubmitting}
								className='flex items-center gap-2'
								onClick={form.handleSubmit(onSubmit)}
							>
								{isSubmitting ? 'Submitting...' : 'Submit'}
							</Button>
						) : (
							<Button
								type='button'
								onClick={nextStep}
								className='flex items-center gap-2'
							>
								Next
								<ChevronRight className='h-4 w-4' />
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
