import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './scroll-fix.css';

import { Providers as ReduxPrvoviders } from '@/redux/Providers';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'HallEase',
	description: 'Event and Hall Management System',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='h-full'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
			>
				<ReduxPrvoviders>{children}</ReduxPrvoviders>
			</body>
		</html>
	);
}
