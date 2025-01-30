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
import { FormCreateCustomer } from '../FormCreateCustomer';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

export function HeaderEnrollment() {
	const [openModalCreate, setOpenModalCreate] = useState(false);
	const handleUpdateSaldo = async () => {
		try {
			const response = await axios.post('/api/enrollment/updateSaldoPendiente');
		} catch (error) {
			toast({
				title: 'Error al intentar actualizar los saldos pendientes.',
			});
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

					<FormCreateCustomer setOpenModalCreate={setOpenModalCreate} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
