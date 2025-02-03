'use client';

import { useRouter } from 'next/navigation';

import axios, { AxiosError } from 'axios';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { PlanFooterProps } from './PlanFooter.types';
import { toast } from '@/components/ui/use-toast';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useState } from 'react';

export function PlanFooter(props: PlanFooterProps) {
	const { planId } = props;
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDelete = () => {
		setIsModalOpen(true);
	};

	const confirmDelete = () => {
		console.log(`Eliminando el registro con ID: ${planId}`);
		onDeletePlan();
		setIsModalOpen(false);
	};

	const cancelDelete = () => {
		setIsModalOpen(false);
	};

	const onDeletePlan = async () => {
		try {
			await axios.delete(`/api/plan/${planId}`);
			toast({
				title: 'Plan Eliminado',
			});
			router.push('/plans');
			router.refresh();
		} catch (error) {
			// Asegurarse de que `error` es un AxiosError
			if (error instanceof AxiosError) {
				const errorMessage = error.response?.data?.message || 'Algo salió mal';

				toast({
					title: errorMessage, // Mostrar el mensaje de error recibido desde la API
					variant: 'destructive',
				});
			} else {
				toast({
					title: 'Something went wrong',
					variant: 'destructive',
				});
			}
		}
	};

	return (
		<div className="flex justify-end mt-5">
			<Button variant="destructive" onClick={() => handleDelete()}>
				<Trash className="w-4 h-4 mr-2" />
				Eliminar Plan
			</Button>

			{/* Modal de Confirmación */}
			<ConfirmationModal
				isOpen={isModalOpen}
				title="¿Estás seguro?"
				description="Esta acción no se puede deshacer. ¿Deseas continuar?"
				onConfirm={confirmDelete}
				onCancel={cancelDelete}
			/>
		</div>
	);
}
