// pages/500.tsx
export default function Custom500() {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
			<h1 className="text-4xl font-bold text-red-600">
				500 - Error en el servidor
			</h1>
			<p className="mt-4 text-lg text-gray-700">
				{' '}
				Ha ocurrido un error interno en el servidor. Intenta nuevamente más
				tarde.
			</p>
			<a href="/" className="mt-6 text-blue-600 underline">
				Volver al inicio
			</a>
		</div>
	);
}
