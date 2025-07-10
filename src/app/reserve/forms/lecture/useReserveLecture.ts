import { useState } from 'react';
import { submitBooking } from './reserve.lecture.service';
import { ReserveLectureFormData } from './reserve.lecture.data';

export function useBooking() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [draftId, setDraftId] = useState<string | null>(null); // Track current draft ID
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // Track if form has been submitted

	const handleSubmit = async (
		formData: ReserveLectureFormData,
		status: 'pending' | 'draft'
	) => {
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
			const result = await submitBooking(
				formData,
				status,
				draftId || undefined
			);

			// If this was a draft save, store the draft ID for future updates
			if (status === 'draft') {
				setDraftId(result.reserveId);
				setIsSubmitted(false); // Still allow future submission
			} else {
				// If submitted successfully, mark as submitted and keep the ID
				setDraftId(result.reserveId);
				setIsSubmitted(true); // Prevent further submissions
			}

			setSuccess(true);
			return result;
		} catch (err: unknown) {
			const passedError = err as Error;
			console.log(passedError);
			setError(passedError.message || 'Failed to submit booking data!');
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
