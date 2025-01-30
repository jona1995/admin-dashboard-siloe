'use client';
import { MoreHorizontal, Pencil, EyeIcon } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';
import { StudentWithUser } from './modelos';
export const columns: ColumnDef<StudentWithUser>[] = [
	{
		accessorKey: 'nombre',
		header: 'Nombres',
	},
	{
		accessorKey: 'apellido',
		header: 'Apellidos',
	},
	{
		accessorKey: 'cedula',
		header: 'Cedula',
	},
	{
		accessorKey: 'telefono',
		header: 'Telefono',
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'iglesia',
		header: 'Iglesia',
	},
	{
		accessorKey: 'localidadIglesia',
		header: 'Localidad Iglesia',
	},
	{
		accessorKey: 'createdByName',
		header: 'User Create',
		cell: ({ row }) => row.original.createdByName,
	},

	{
		accessorKey: 'updatedByName',
		header: 'User Update',
		cell: ({ row }) => row.original.updatedByName,
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
						<Link href={`/students/${id}`}>
							<DropdownMenuItem>
								<Pencil className="w-4 h-4 mr-2" />
								Editar
							</DropdownMenuItem>
						</Link>
						<Link href={`/students/detail/${id}`}>
							<DropdownMenuItem>
								<EyeIcon className="w-4 h-4 mr-2" />
								Ver
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
