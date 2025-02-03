import { SignIn } from '@clerk/nextjs';

// pages/signin.tsx
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Page = () => {
	const { user } = useUser(); // Obtén el estado del usuario
	const router = useRouter();

	useEffect(() => {
		if (user) {
			// Redirigir si el usuario ya está autenticado
			router.push('/'); // Cambia '/home' por la página de inicio o la página que prefieras
		}
	}, [user, router]);

	if (user) return null; // No renderizar el formulario si el usuario ya está autenticado

	return (
		<div>
			<SignIn path="/sign-in" />;
		</div>
	);
};

export default Page;
