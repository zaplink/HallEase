// Utility to manually refresh drafts across the application
export const triggerDraftRefresh = () => {
	// Dispatch a custom event that can be listened to by components
	window.dispatchEvent(new CustomEvent('refreshDrafts'));
};

// Hook to listen for draft refresh events
export const useDraftRefreshListener = (callback: () => void) => {
	const handleRefresh = () => {
		callback();
	};

	if (typeof window !== 'undefined') {
		window.addEventListener('refreshDrafts', handleRefresh);

		return () => {
			window.removeEventListener('refreshDrafts', handleRefresh);
		};
	}

	return () => {};
};
