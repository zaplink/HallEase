'use client';

import { Provider } from 'react-redux';
import { store, persistor } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from '@/components/custom/Loading';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/redux/useAppDispatch'; // ✅ Correct import
import { fetchUserData } from '@/redux/authSlice';
import { RootState } from '@/redux/store';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<PersistGate
				loading={<Loading text='Saving Things' pageView={true} />}
				persistor={persistor}
			>
				<InnerProviders>{children}</InnerProviders>{' '}
				{/* ✅ Move logic inside a child component */}
			</PersistGate>
		</Provider>
	);
}

// ✅ This ensures Redux Provider is initialized before using `useAppDispatch`
function InnerProviders({ children }: { children: React.ReactNode }) {
	const dispatch = useAppDispatch(); // ✅ Now inside the Provider
	const user = useSelector((state: RootState) => state.auth.user);

	useEffect(() => {
		if (!user) {
			dispatch(fetchUserData()); // ✅ Fetch user data on mount
		}
	}, [dispatch, user]);

	return <>{children}</>;
}
