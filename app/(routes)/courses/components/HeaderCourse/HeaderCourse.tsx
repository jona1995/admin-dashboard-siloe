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

export function HeaderCourse() {
	const [openModalCreate, setOpenModalCreate] = useState(false);

	return (
		<div className="flex items-center justify-between">
			<h2 className="text-2xl">Lista de Cursos</h2>

			<Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
				<DialogTrigger asChild>
					<Button>Crear Curso</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[725px] sm:max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Crear Curso</DialogTitle>
						<DialogDescription>
							Ingresar la informacion del curso
						</DialogDescription>
					</DialogHeader>

					<FormCreateCustomer setOpenModalCreate={setOpenModalCreate} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
