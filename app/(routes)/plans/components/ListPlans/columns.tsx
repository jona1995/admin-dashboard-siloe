'use client';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';

import { Plan } from '@prisma/client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';
import { Plans_model } from '../../utils/type_model';

export const columns: ColumnDef<Plans_model>[] = [
	{
		accessorKey: 'nombre',
		header: 'Nombre',
	},
	{
		accessorKey: 'precioFinal',
		header: 'Precio',
		cell: ({ row }) => {
			const precio = row.original.precioFinal; // Obtén el valor del precio
			return (
				<div className="flex items-center">
					<span className="text-gray-500">$</span>
					<span className="ml-1">{Number(precio).toFixed(2)}</span>{' '}
					{/* Formato a 2 decimales */}
				</div>
			);
		},
	},
	{
		accessorKey: 'item',
		header: 'Descuento',
		cell: ({ row }) => {
			const items = row.original.items; // Suponemos que row.original.item es un array de PlanItem
			return (
				<div>
					{items.map(planItem => {
						// const curso = availableCourses.find(c => c.id === planItem.cursoId); // Encuentra el curso correspondiente
						return (
							<div key={planItem.id} className="mb-2">
								<div>
									Cantidad: {planItem.cantidad}, Curso:
									{planItem.curso
										? planItem.curso.nombre
										: 'Curso no encontrado'}
									, Descuento: {planItem.descuento}%
								</div>
							</div>
						);
					})}
				</div>
			);
		},
	},
	{
		accessorKey: 'descripcion',
		header: 'Descripcion',
	},
	{
		id: 'actions',
		header: 'Actions',
		enableSorting: false,
		cell: ({ row }) => {
			const { id } = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button variant="ghost" className="w-8 h-4 p-0">
							<span className="sr-only">Open Menu</span>
							<MoreHorizontal className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<Link href={`/plans/${id}`}>
							<DropdownMenuItem>
								<Pencil className="w-4 h-4 mr-2" />
								Editar
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
