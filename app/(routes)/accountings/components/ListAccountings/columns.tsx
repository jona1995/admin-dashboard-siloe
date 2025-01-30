'use client';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';

import { FinancialTransaction } from '@prisma/client';

import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';

export const columns: ColumnDef<FinancialTransaction>[] = [
	{
		accessorKey: 'fecha',
		header: 'Fecha',
		cell: ({ row }) => moment(row.getValue('fecha')).format('DD/MM/YYYY'),
		filterFn: (row, columnId, filterValue) => {
			if (!filterValue) return true; // Si no hay filtro, muestra todas las filas.

			const rowDate = moment(row.original.fecha, 'YYYY-MM-DD');
			const fromDate = moment(filterValue, 'DD/MM/YYYY'); // Convierte el filtro ingresado por el usuario.

			// Verifica si la fecha de la fila es igual o posterior a la fecha del filtro.
			return (
				rowDate.isValid() &&
				fromDate.isValid() &&
				rowDate.isSameOrAfter(fromDate, 'day')
			);
		},
	},
	{
		accessorKey: 'descripcion',
		header: 'Descripcion',
	},
	{
		accessorKey: 'monto',
		header: 'Monto',
		cell: ({ row }) => {
			const precio = row.original.monto; // Obtén el valor del precio
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
		accessorKey: 'tipo',
		header: 'Tipo',
		cell: ({ row }) => {
			const estado = row.original.tipo;
			return (
				<span
					className={`px-2 py-1 rounded text-white ${
						estado === 'INGRESO'
							? 'bg-green-500'
							: estado === 'EGRESO'
							? 'bg-red-500'
							: 'bg-gray-500'
					}`}
				>
					{estado}
				</span>
			);
		},
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
						<Link href={`/accountings/${id}`}>
							<DropdownMenuItem>
								<Pencil className="w-4 h-4 mr-2" />
								Edit
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
	},
];
