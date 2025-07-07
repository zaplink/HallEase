import { useState } from 'react';
import { submitBooking } from './reserve.lecture.service';
import { ReserveLectureFormData } from './reserve.lecture.data';

export function useBooking() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [draftId, setDraftId] = useState<string | null>(null); // Track current draft ID

	const handleSubmit = async (
		formData: ReserveLectureFormData,
		status: 'pending' | 'draft'
	) => {
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
			} else {
				// If submitted, clear the draft ID
				setDraftId(null);
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
	};

	return { handleSubmit, isLoading, error, success, reset, draftId };
}
