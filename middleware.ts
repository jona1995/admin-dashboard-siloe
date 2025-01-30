import { authMiddleware } from '@clerk/nextjs';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default authMiddleware({
	publicRoutes: ['/api/uploadthing'],
	afterAuth: async (auth, req) => {
		const { userId } = auth;

		if (userId) {
			try {
				// Obtener detalles del usuario desde Clerk
				const user = await clerkClient.users.getUser(userId);

				// Clonar los headers y agregar la información del usuario
				const headers = new Headers(req.headers);
				headers.set('x-user-name', `${user.firstName} ${user.lastName}`);
				headers.set('x-user-email', user.emailAddresses[0]?.emailAddress || '');

				return NextResponse.next({ headers });
			} catch (error) {
				console.error('Error obteniendo el usuario de Clerk:', error);
			}
		}

		return NextResponse.next();
	},
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
