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
		accessorFn: row => row.user.nombre, // Accede al nombre dentro de 'user'
		header: 'Nombres',
	},
	{
		accessorFn: row => row.user.apellido, // Accede al apellido dentro de 'user'
		header: 'Apellidos',
	},
	{
		accessorFn: row => row.user.cedula, // Accede a la cédula dentro de 'user'
		header: 'Cedula',
	},
	{
		accessorFn: row => row.user.telefono, // Accede al teléfono dentro de 'user'
		header: 'Telefono',
	},
	{
		accessorFn: row => row.user.email, // Accede al email dentro de 'user'
		header: 'Email',
	},
	{
		accessorFn: row => row.user.iglesia, // Accede a la iglesia dentro de 'user'
		header: 'Iglesia',
	},
	{
		accessorFn: row => row.user.localidadIglesia, // Accede a la localidadIglesia dentro de 'user'
		header: 'Localidad Iglesia',
	},
	{
		accessorFn: row => row.user.state, // Accede al estado dentro de 'user'
		header: 'Estado',
	},
	{
		accessorKey: 'createdByName', // Accede a 'createdByName' directamente
		header: 'User Create',
		cell: ({ row }) => row.original.createdByName,
	},
	{
		accessorKey: 'updatedByName', // Accede a 'updatedByName' directamente
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
