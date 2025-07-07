import { useState } from 'react';
import { submitReserveEvent } from './reserve.event.service';
import { ReserveEventFormData } from './reserve.event.data';

export function useBooking() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [draftId, setDraftId] = useState<string | null>(null); // Track current draft ID

	const handleSubmit = async (
		formData: ReserveEventFormData,
		status: 'pending' | 'draft'
	) => {
		console.log('useBooking handleSubmit called with:', {
			formData,
			status,
			draftId,
		});

		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			console.log('Submitting booking...');
			const result = await submitReserveEvent(
				formData,
				status,
				draftId || undefined
			);
			console.log('Booking submitted successfully, result:', result);

			// If this was a draft save, store the draft ID for future updates
			if (status === 'draft') {
				setDraftId(result.reserveId);
			} else {
				// If submitted, clear the draft ID
				setDraftId(null);
			}

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
		setDraftId(null); // Also reset draft ID
	};

	return { handleSubmit, isLoading, error, success, reset, draftId };
}
