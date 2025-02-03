'use client';

import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseFooterProps } from './CourseFooter.types';
import { toast } from '@/components/ui/use-toast';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useState } from 'react';
import { Spinner } from '@/components/Spinner/spinner';

export function CourseFooter(props: CourseFooterProps) {
	const { courseId } = props;
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false); // Estado para saber si está cargando

	const handleDelete = () => {
		setIsModalOpen(true);
	};

	const confirmDelete = async () => {
		setIsLoading(true); // Activar el spinner

		try {
			await onDeleteCourse();
			setIsModalOpen(false); // Cerrar el modal después de la eliminación
		} catch (error) {
			setIsLoading(false); // Desactivar el spinner si hay error
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

	const cancelDelete = () => {
		setIsModalOpen(false);
	};

	const onDeleteCourse = async () => {
		try {
			await axios.delete(`/api/course/${courseId}`);
			toast({
				title: 'Curso Eliminado',
			});
			router.push('/courses');
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
		} finally {
			setIsLoading(false); // Desactivar el spinner después de la operación
		}
	};

	return (
		<div className="flex justify-end mt-5">
			<Button
				variant="destructive"
				onClick={() => handleDelete()}
				disabled={isLoading}
			>
				<>
					<Trash className="w-4 h-4 mr-2" />
					Eliminar Curso
				</>
			</Button>
			{/* Modal de Confirmación */}
			{isLoading ? (
				<div className="flex items-center">
					<Spinner /> {/* Muestra el spinner */}
					Eliminando...
				</div>
			) : (
				<ConfirmationModal
					isOpen={isModalOpen}
					title="¿Estás seguro?"
					description="Esta acción no se puede deshacer. ¿Deseas continuar?"
					onConfirm={confirmDelete}
					onCancel={cancelDelete}
				/>
			)}
		</div>
	);
}
