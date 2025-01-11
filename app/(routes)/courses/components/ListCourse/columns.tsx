'use client';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';

import { Course } from '@prisma/client';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';

export const columns: ColumnDef<Course>[] = [
	{
		accessorKey: 'nombre',
		header: 'Nombres',
	},
	{
		accessorKey: 'descripcion',
		header: 'Descripcion',
	},
	{
		accessorKey: 'duracion',
		header: 'Duracion (Meses)',
	},
	{
		accessorKey: 'subjectsNames',
		header: 'Materias',
	},
	{
		accessorKey: 'revenuePercentage',
		header: 'Porcentaje',
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
						<Link href={`/courses/${id}`}>
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
