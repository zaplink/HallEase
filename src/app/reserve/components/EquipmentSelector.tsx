'use client';

import React, { useMemo } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Combobox } from '@/components/combobox';
import { X } from 'lucide-react';
import { equipmentOptions } from '../event/reserve.event.data';

type EquipmentItem = {
	equipment: string;
	quantity: number;
};

export default function EquipmentSelector() {
	const { control } = useFormContext<{ equipments: EquipmentItem[] }>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'equipments',
	});

	const watchedEquipments = useWatch({ control, name: 'equipments' });

	const equipmentValues = useMemo(() => {
		return watchedEquipments?.map((e) => e?.equipment) || [];
	}, [watchedEquipments]);

	const availableOptions = useMemo(() => {
		return equipmentOptions.filter(
			(option) => !equipmentValues.includes(option.value)
		);
	}, [equipmentValues]);

	return (
		<div className='space-y-4'>
			{fields.map((field, index) => (
				<div key={field.id} className='flex gap-4 items-end pb-4 px-2'>
					{/* Equipment Dropdown */}
					<FormField
						control={control}
						name={`equipments.${index}.equipment`}
						rules={{ required: 'Please select an equipment' }}
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Equipment:</FormLabel>
								<FormControl>
									<Combobox
										options={equipmentOptions.filter(
											(opt) =>
												opt.value === field.value ||
												!equipmentValues.includes(
													opt.value
												)
										)}
										value={field.value}
										onChange={field.onChange}
										placeholder='Select Equipment'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Quantity Input */}
					<FormField
						control={control}
						name={`equipments.${index}.quantity`}
						rules={{
							required: 'Required',
							min: { value: 1, message: 'Must be > 0' },
						}}
						render={({ field }) => (
							<FormItem className='w-24'>
								<FormLabel>Qty</FormLabel>
								<FormControl>
									<Input type='number' min={1} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Remove Button */}
					<Button
						type='button'
						variant='outline'
						onClick={() => remove(index)}
						className='h-10'
					>
						<X />
					</Button>
				</div>
			))}

			{/* Add Button */}
			{availableOptions.length > 0 && (
				<Button
					className='my-4 mx-2'
					type='button'
					variant='secondary'
					onClick={() => append({ equipment: '', quantity: 1 })}
				>
					+ Add Equipment
				</Button>
			)}
		</div>
	);
}
