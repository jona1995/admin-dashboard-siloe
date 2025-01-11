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
import { Enrollment } from '../../utils/type_model';

export const columns: ColumnDef<Enrollment>[] = [
	{
		accessorKey: 'fechaInscripcion',
		header: 'Fecha Inscripcion',
		cell: ({ row }) =>
			moment(row.getValue('fechaInscripcion')).format('DD/MM/YYYY'),
	},
	{
		accessorKey: 'estudianteId',
		header: 'Estudiante',
		cell: ({ row }) => row.original.student.nombre,
	},
	{
		accessorKey: 'courseNames',
		header: 'Curso',
	},
	{
		accessorKey: 'estado',
		header: 'Estado',
	},
	{
		accessorKey: 'planId',
		header: 'Plan',
		cell: ({ row }) => row.original.plan.nombre,
	},
	{
		accessorKey: 'modalidad',
		header: 'Modalidad',
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
						<Link href={`/enrollments/${id}`}>
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
