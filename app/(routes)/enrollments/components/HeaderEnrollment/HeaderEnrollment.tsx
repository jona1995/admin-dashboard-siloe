'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { FormCreateEnrolloment } from '../FormCreateEnrolloment';
import { toast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';

export function HeaderEnrollment() {
	const [openModalCreate, setOpenModalCreate] = useState(false);
	const handleUpdateSaldo = async () => {
		try {
			const response = await axios.post('/api/enrollment/updateSaldoPendiente');

			if (response.status === 200) {
				// Aquí obtienes el mensaje de éxito de la API y lo muestras con el toast
				const successMessage =
					response.data.message || 'Inscripcion realizado con éxito';

				toast({
					title: successMessage,
				});
			} else {
				// Si no es un 200, puedes manejarlo aquí como un error
				throw new Error('Hubo un problema con el inscripcion');
			}
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
		<div className="flex items-center justify-between">
			<h2 className="text-2xl">Lista de Incripciones</h2>
			<Button onClick={handleUpdateSaldo}>Actualizar Saldos Pendientes</Button>
			<Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
				<DialogTrigger asChild>
					<Button>Crear Inscripcion</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[725px] sm:max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Crear Incripcion</DialogTitle>
						<DialogDescription>
							Ingresar la informacion de la Incripcion
						</DialogDescription>
					</DialogHeader>

					<FormCreateEnrolloment setOpenModalCreate={setOpenModalCreate} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
