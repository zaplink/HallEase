import { useState } from 'react';
import { submitReserveEvent } from './reserve.event.service';
import { ReserveEventFormData } from './reserve.event.data';

export function useBooking() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const handleSubmit = async (
		formData: ReserveEventFormData,
		status: 'pending' | 'draft'
	) => {
		console.log('useBooking handleSubmit called with:', {
			formData,
			status,
		});

		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			console.log('Submitting booking...');
			const result = await submitReserveEvent(formData, status);
			console.log('Booking submitted successfully, result:', result);
			console.log('Booking submitted, sending email...');

			const toEmail = result.requesterEmail;

			const emailRes = await fetch('/api/send-test-mail', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					toEmail,
					eventName: formData.name, // Assuming name is event name
					organizer: formData.organizer, // Make sure this exists
					eventLocation: formData.hall, // Make sure this exists
					date: formData.date, // Make sure this exists and is a string
					reservationId: result.reserveId, // Assuming result contains the created reservation ID
					reservationLink: `https://example.com/reservation/${result.reserveId}`, // Adjust this
				}),
			});

			if (!emailRes.ok) {
				const errText = await emailRes.text();
				throw new Error('Failed to send email: ' + errText);
			}
			setSuccess(true);
			return result;
		} catch (err: unknown) {
			console.log('Error in handleSubmit:', err);
			setError(
				(err as Error).message || 'Failed to submit booking data!'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const reset = () => {
		setIsLoading(false);
		setError(null);
		setSuccess(false);
	};

	return { handleSubmit, isLoading, error, success, reset };
}
