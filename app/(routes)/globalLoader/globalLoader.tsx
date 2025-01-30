// components/GlobalLoader.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Este hook es de Next.js para obtener la ruta
import { Spinner } from '@/components/Spinner/spinner';

export default function GlobalLoader({
	children,
}: {
	children: React.ReactNode;
}) {
	const [loading, setLoading] = useState(false);
	const pathname = usePathname(); // Obtener la ruta actual

	// Cada vez que cambie la ruta, activamos el loading
	useEffect(() => {
		setLoading(true);
		const timeout = setTimeout(() => setLoading(false), 500); // Simulamos un tiempo de carga de 500ms
		return () => clearTimeout(timeout); // Limpiamos el timeout cuando la ruta cambia
	}, [pathname]); // El hook se activa cada vez que cambia la ruta

	return (
		<>
			{loading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<Spinner />
				</div>
			)}
			{children} {/* Aquí es donde se renderiza el contenido de la página */}
		</>
	);
}
