// pages/404.tsx
export default function Custom404() {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
			<h1 className="text-4xl font-bold text-red-600">
				404 - Página no encontrada
			</h1>
			<p className="mt-4 text-lg text-gray-700">
				Lo sentimos, la página que buscas no existe.
			</p>
			<a href="/" className="mt-6 text-blue-600 underline">
				Volver al inicio
			</a>
		</div>
	);
}
