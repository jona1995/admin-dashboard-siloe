'use client';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';

import { Payment } from '@prisma/client';

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
import { Payment_model } from '../../utils/type_model';

export const columns: ColumnDef<Payment_model>[] = [
	{
		accessorKey: 'fechaPago',
		header: 'Fecha Pago',
		cell: ({ row }) => moment(row.getValue('fecha')).format('DD/MM/YYYY'),
	},
	{
		accessorKey: 'monto',
		header: 'Monto',
	},
	{
		accessorKey: 'estadoPago',
		header: 'Estado Pago',
	},
	{
		accessorKey: 'tipoPago',
		header: 'Tipo Pago',
	},
	{
		accessorKey: 'pagador',
		header: 'Pagador',
		cell: ({ row }) => row.original.pagador.nombre,
	},
	{
		accessorKey: 'beneficiarios',
		header: 'Beneficiarios',
		cell: ({ row }) => row.original.pagador.nombre,
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
						<Link href={`/payments/${id}`}>
							<DropdownMenuItem>
								<Pencil className="w-4 h-4 mr-2" />
								Edit
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
