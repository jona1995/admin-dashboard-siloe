import { auth, clerkClient } from '@clerk/nextjs';
import { db } from '@/lib/db';

export default async function middleware(req: Request) {
	const { userId } = auth();

	if (userId) {
		// Verificar si el usuario existe en la base de datos
		const usuario = await db.usuario.findUnique({ where: { clerkId: userId } });

		if (!usuario) {
			// Obtener datos de Clerk y sincronizar
			const user = await clerkClient.users.getUser(userId);
			const email = user.emailAddresses[0]?.emailAddress || '';
			const nombre = user.firstName || 'Usuario';

			await db.usuario.create({
				data: {
					clerkId: userId,
					email: email,
					nombre,
					tipo: 'ESTUDIANTE', // O el tipo adecuado
				},
			});
		}
	}

	return NextResponse.next();
}
