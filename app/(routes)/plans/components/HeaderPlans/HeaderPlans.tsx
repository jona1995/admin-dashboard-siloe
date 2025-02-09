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
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { FormCreatePlan } from '../FormCreatePlan';

export function HeaderPlans() {
	const [openModalCreate, setOpenModalCreate] = useState(false);

	return (
		<div className="flex items-center justify-between">
			<h2 className="text-2xl">Lista de Planes</h2>

			<Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
				<DialogTrigger asChild>
					<Button>Crear Plan</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[725px] sm:max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Crear Plan</DialogTitle>
						<DialogDescription>
							Ingresar la informacion del Plan
						</DialogDescription>
					</DialogHeader>

					<FormCreatePlan setOpenModalCreate={setOpenModalCreate} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
