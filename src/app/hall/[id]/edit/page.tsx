'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import SidebarLayout from '@/layouts/Sidebar/Layout';
import PageHeader from '@/components/custom/PageHeader';
import Loading from '@/components/custom/Loading';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';

import { getHall } from '@/lib/getHall';
import { updateHall, UpdateHallData } from '@/lib/updateHall';
import { Hall as HallType } from '@/app/halls/hall';
import { toast } from 'sonner';

// Hall type options
const hallTypeOptions = [
	{ value: 'EW', label: 'Engineering Workshop' },
	{ value: 'LCH', label: 'Lecture Hall' },
	{ value: 'CMP', label: 'Computer Lab' },
	{ value: 'CMP-VR', label: 'Computer Lab - VR' },
	{ value: 'CMP-MAIN', label: 'Computer Lab - Main' },
	{ value: 'CMP-MAT', label: 'Computer Lab - Material' },
	{ value: 'CMP-DAT', label: 'Computer Lab - Data Science' },
	{ value: 'ELP', label: 'Chemistry Lab' },
	{ value: 'ML', label: 'Mechanical Lab' },
];

// Form validation schema
const formSchema = z.object({
	code: z.string().min(1, 'Hall code is required'),
	capacity: z.number().min(1, 'Capacity must be at least 1'),
	building: z.string().min(1, 'Building is required'),
	description: z.string().optional(),
	floor: z.number().min(0, 'Floor must be 0 or greater'),
	type: z.string().min(1, 'Hall type is required'),
	is_available: z.boolean(),
	energy_consumption: z
		.number()
		.min(0)
		.max(100, 'Energy consumption must be between 0 and 100'),
});

type FormData = z.infer<typeof formSchema>;

export default function EditHallPage() {
	const { id: hallCode } = useParams<{ id: string }>();
	const router = useRouter();

	const [hall, setHall] = useState<HallType | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			code: '',
			capacity: 0,
			building: '',
			description: '',
			floor: 0,
			type: '',
			is_available: true,
			energy_consumption: 0,
		},
	});

	useEffect(() => {
		if (!hallCode) return;

		const fetchHall = async () => {
			setLoading(true);
			try {
				const hallData = await getHall(hallCode);
				if (hallData) {
					setHall(hallData);
					// Reset form with fetched data
					form.reset({
						code: hallData.code,
						capacity: hallData.capacity,
						building: hallData.building,
						description: hallData.description || '',
						floor: hallData.floor,
						type: hallData.type,
						is_available: hallData.is_available,
						energy_consumption: hallData.energy_consumption,
					});
				}
			} catch (error) {
				console.error('Error fetching hall:', error);
				toast.error('Failed to fetch hall data');
			} finally {
				setLoading(false);
			}
		};

		fetchHall();
	}, [hallCode, form]);

	const onSubmit = async (data: FormData) => {
		if (!hall) return;

		setSaving(true);
		try {
			// Ensure proper data types
			const updateData: UpdateHallData = {
				code: data.code.trim(),
				capacity: Number(data.capacity),
				building: data.building.trim(),
				description: data.description?.trim() || undefined,
				floor: Number(data.floor),
				type: data.type,
				is_available: Boolean(data.is_available),
				energy_consumption: Number(data.energy_consumption),
			};

			console.log('Original hall code:', hall.code);
			console.log('Form data to update:', updateData);

			const result = await updateHall(hall.code, updateData);
			console.log('Update result:', result);

			toast.success('Hall updated successfully!');

			// Navigate to the updated hall (in case the code changed)
			router.push(`/hall/${data.code}`);
		} catch (error) {
			console.error('Error updating hall:', error);
			toast.error(
				`Failed to update hall: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			setSaving(false);
		}
	};

	const handleCancel = () => {
		if (hall) {
			router.push(`/hall/${hall.code}`);
		} else {
			router.push('/halls');
		}
	};

	if (loading) {
		return (
			<SidebarLayout>
				<Loading className='mt-10 mx-auto' />
			</SidebarLayout>
		);
	}

	if (!hall) {
		return (
			<SidebarLayout>
				<PageHeader title='Edit Hall' />
				<div className='flex justify-center items-center h-64'>
					<p className='text-lg text-gray-500'>Hall not found</p>
				</div>
			</SidebarLayout>
		);
	}

	return (
		<SidebarLayout>
			<PageHeader
				title={`Edit Hall: ${hall.code}`}
				descriptions={['Update hall information and settings']}
			/>

			<div className='container mx-auto max-w-4xl space-y-6'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-6'
					>
						{/* Basic Information */}
						<Card>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='code'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Hall Code</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='e.g., AB-CMP-01-1'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='capacity'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Capacity</FormLabel>
												<FormControl>
													<Input
														{...field}
														type='number'
														placeholder='e.g., 50'
														onChange={(e) =>
															field.onChange(
																parseInt(
																	e.target
																		.value
																) || 0
															)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='building'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Building</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='e.g., ACD'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='floor'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Floor</FormLabel>
												<FormControl>
													<Input
														{...field}
														type='number'
														placeholder='e.g., 1'
														onChange={(e) =>
															field.onChange(
																parseInt(
																	e.target
																		.value
																) || 0
															)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name='type'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Hall Type</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Select hall type' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{hallTypeOptions.map(
														(option) => (
															<SelectItem
																key={
																	option.value
																}
																value={
																	option.value
																}
															>
																{option.label}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Description (Optional)
											</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder='Enter hall description...'
													rows={3}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* Settings */}
						<Card>
							<CardHeader>
								<CardTitle>Settings</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<FormField
										control={form.control}
										name='energy_consumption'
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Energy Consumption (%)
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														type='number'
														min='0'
														max='100'
														placeholder='e.g., 25'
														onChange={(e) =>
															field.onChange(
																parseInt(
																	e.target
																		.value
																) || 0
															)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='is_available'
										render={({ field }) => (
											<FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
												<div className='space-y-0.5'>
													<FormLabel>
														Availability Status
													</FormLabel>
													<div className='text-sm text-gray-500'>
														{field.value ? (
															<Badge variant='default'>
																Available
															</Badge>
														) : (
															<Badge variant='destructive'>
																Not Available
															</Badge>
														)}
													</div>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={
															field.onChange
														}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Action Buttons */}
						<div className='flex justify-end space-x-4'>
							<Button
								type='button'
								variant='outline'
								onClick={handleCancel}
								disabled={saving}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={saving}>
								{saving ? 'Saving...' : 'Save Changes'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</SidebarLayout>
	);
}
