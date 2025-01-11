'use client';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';
import moment from 'moment';
import { Evaluation } from '../../utils/enum';

export const columns: ColumnDef<Evaluation>[] = [
	{
		accessorKey: 'estudianteId',
		header: 'Estudiante',
		cell: ({ row }) => row.original.student.nombre,
	},
	{
		accessorKey: 'nombre',
		header: 'Nombres',
	},
	{
		accessorKey: 'descripcion',
		header: 'Descripcion',
	},
	{
		accessorKey: 'tipo',
		header: 'Tipo',
	},
	{
		accessorKey: 'fecha',
		header: 'Fecha',
		cell: ({ row }) => moment(row.getValue('fecha')).format('DD/MM/YYYY'),
	},
	{
		accessorKey: 'subjectId',
		header: 'Materia',
		cell: ({ row }) => row.original.subject.nombre,
	},
	{
		accessorKey: 'nota',
		header: 'Nota',
	},
	{
		accessorKey: 'comentario',
		header: 'Comentario',
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
						<Link href={`/evaluations/${id}`}>
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
