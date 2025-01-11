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

export const columns: ColumnDef<Plan>[] = [
	{
		accessorKey: 'nombre',
		header: 'Nombres',
	},
	{
		accessorKey: 'precioBase',
		header: 'Precio',
	},
	{
		accessorKey: 'cantidadDiplomaturas',
		header: 'Cantidad Diplomatura',
	},
	{
		accessorKey: 'precioDiplomatura',
		header: 'Precio Diplomatura',
	},
	{
		accessorKey: 'cantidadBachilleratos',
		header: 'Cantidad Bachillerato',
	},
	{
		accessorKey: 'precioBachillerato',
		header: 'Precio Bachillerato',
	},
	{
		accessorKey: 'descripcion',
		header: 'Descripcion',
	},
	{
		id: 'actions',
		header: 'Actions',
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
