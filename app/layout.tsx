import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Noto_Sans_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';
const noto = Noto_Sans_Display({ subsets: ['latin'] });
export const metadata: Metadata = {
	title: 'Dashboard Admin | Siloe',
	description: 'Seminario Siloe ',
	keywords: 'dashboard, administración, seminario, Siloe',
	openGraph: {
		title: 'Dashboard Admin | Siloe',
		description: 'Gestión administrativa del seminario Siloe',
		url: 'https://siloe.com.uy',
		siteName: 'Dashboard Siloe',
		images: [
			{
				url: '/logo_siloe.png',
				width: 1200,
				height: 630,
				alt: 'Imagen del Dashboard Siloe',
			},
		],
		locale: 'es_ES',
		type: 'website',
	},
	// twitter: {
	// 	card: 'summary_large_image',
	// 	title: 'Dashboard Admin | Siloe',
	// 	description: 'Gestión administrativa del seminario Siloe',
	// 	images: ['/twitter-image.png'],
	// },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<head>
					<link
						rel="icon"
						href="/favicon.ico"
						sizes="16x16"
						type="image/x-icon"
					/>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
				</head>
				<body className={noto.className}>
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
