import SidebarLayout from '@/layouts/Sidebar/Layout';
import React from 'react';
import SignupForm from './SignupForm';
import PageHeader from '@/components/custom/PageHeader';
import ProtectedPage from '@/layouts/ProtectedPage';

const Registration = () => {
	return (
		<>
			<ProtectedPage>
			<SidebarLayout>
				<PageHeader title='Register a New User' />
				<SignupForm />
			</SidebarLayout>
			</ProtectedPage>
		</>
	);
};

export default Registration;
