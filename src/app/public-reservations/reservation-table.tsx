'use client';
// components/DataTable.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { supabase } from '@/lib/supabaseClient';
// Define the Reservation type locally since '@/types/reservation' cannot be found
type Reservation = {
	id: string;
	eventname: string;
	date?: string;
	request_for?: string;
	contact_name?: string;
	description?: string;
};

const ReservationTable: React.FC = () => {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	// Fetch reservations from Supabase
	useEffect(() => {
		const fetchReservations = async () => {
			try {
				const { data, error } = await supabase
					.from('public_reservation')
					.select(
						'id, eventname, date, request_for, contact_name, description'
					);

				if (error) {
					throw error;
				}

				setReservations(data || []);
			} catch (err) {
				setError('Failed to fetch reservations');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchReservations();
	}, []);

	// Handle row click to navigate to /review/[id]
	const handleRowClick = (id: string) => {
		router.push(`/review/${id}`);
	};

	if (loading) {
		return <div className='text-center text-gray-500'>Loading...</div>;
	}

	if (error) {
		return <div className='text-center text-red-500'>{error}</div>;
	}

	return (
		<div className='container mx-auto p-4'>
			<Table>
				<TableCaption>A list of recent reservations.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[200px]'>Event Name</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Request For</TableHead>
						<TableHead>Contact Name</TableHead>
						<TableHead>Description</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{reservations.map((reservation) => (
						<TableRow
							key={reservation.id}
							className='cursor-pointer hover:bg-gray-100'
							onClick={() => handleRowClick(reservation.id)}
						>
							<TableCell className='font-medium'>
								{reservation.eventname}
							</TableCell>
							<TableCell>{reservation.date || 'N/A'}</TableCell>
							<TableCell>
								{reservation.request_for || 'N/A'}
							</TableCell>
							<TableCell>
								{reservation.contact_name || 'N/A'}
							</TableCell>
							<TableCell>
								{reservation.description || 'N/A'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default ReservationTable;
