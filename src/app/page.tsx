import LoginPage from './front/users/LoginPage';
import ContactUs from './front/contacts/ContactUs';

export default function Home() {
	return (
		<div style={{ position: 'relative', height: '100vh' }}>
			{/* </HomePage> */}
			<LoginPage />
			{/* <Reservations/> */}
			<ContactUs />
		</div>
	);
}
