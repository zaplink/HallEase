export function getBaseUrl(): string {
	// Client-side
	if (typeof window !== 'undefined') {
		return window.location.origin;
	}

	// Server-side
	return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}
