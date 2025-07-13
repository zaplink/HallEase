import { useState } from 'react';
import { submitReserveEvent } from './reserve.event.service';
import {
	ReserveEventFormData,
	formatEventDateTime,
} from './reserve.event.data';

export function useBooking() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [draftId, setDraftId] = useState<string | null>(null); // Track current draft ID
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // Track if form has been submitted

	const handleSubmit = async (
		formData: ReserveEventFormData,
		status: 'pending' | 'draft'
	) => {
		console.log('useBooking handleSubmit called with:', {
			formData,
			status,
			draftId,
			isSubmitted,
		});

		// Prevent multiple submissions if already submitted (unless saving as draft)
		if (isSubmitted && status === 'pending') {
			console.log(
				'Form already submitted, preventing duplicate submission'
			);
			setError('This form has already been submitted.');
			return;
		}

		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			console.log('Submitting booking...');
			console.log('Form data being submitted:', formData);
			console.log('Status:', status);
			console.log('Draft ID:', draftId);

			const result = await submitReserveEvent(
				formData,
				status,
				draftId || undefined
			);
			console.log('Booking submitted successfully, result:', result);
			console.log('Reserve ID returned:', result?.reserveId);

			// If this was a draft save, store the draft ID for future updates
			if (status === 'draft') {
				setDraftId(result.reserveId);
				setIsSubmitted(false); // Still allow future submission
				setSuccess(true); // Mark as successful without sending email
			} else {
				// If submitted successfully, mark as submitted and keep the ID
				setDraftId(result.reserveId);
				setIsSubmitted(true); // Prevent further submissions

				console.log('Booking submitted, sending email...');

				const toEmail = result.requesterEmail;

				// Format date and time for email
				const eventDateTime = formatEventDateTime(formData);
				console.log('Formatted DateTime:', eventDateTime);
				console.log('Form Data:', formData);

				const emailRes = await fetch('/api/send-test-mail', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						toEmail,
						eventName: formData.name,
						reservationType: formData.hallOpt || 'availability',
						hall: formData.hall || '',
						eventDateTime,
						reservationId: result.reserveId,
						reservationLink: `${window.location.origin}/reservation/${result.reserveId}`,
					}),
				});

				if (!emailRes.ok) {
					const errText = await emailRes.text();
					throw new Error('Failed to send email: ' + errText);
				}
				setSuccess(true);
			}
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
		setIsSubmitted(false); // Reset submission state
	};

	return {
		handleSubmit,
		isLoading,
		error,
		success,
		reset,
		draftId,
		isSubmitted,
	};
}
