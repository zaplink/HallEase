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
		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const result = await submitReserveEvent(formData, status);
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
	};

	return { handleSubmit, isLoading, error, success, reset };
}
