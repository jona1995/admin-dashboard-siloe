// app/dashboard/loading.tsx

import { Spinner } from '@/components/Spinner/spinner';

export default function Loading() {
	return (
		<div className="flex items-center justify-center h-screen">
			<Spinner /> {/* Componente de carga */}
		</div>
	);
}
