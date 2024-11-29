import type { Metadata } from 'next';
import { Noto_Sans_Display } from 'next/font/google';
import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const noto = Noto_Sans_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Dashboard admin | siloe',
	description: 'Dashboard admin siloe',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={noto.className}>
					{' '}
					<ThemeProvider
						attribute="class"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
