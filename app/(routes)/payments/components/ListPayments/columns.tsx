'use client';
import { MoreHorizontal, Pencil } from 'lucide-react';
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
		accessorKey: 'fechaPagoMes',
		header: 'Fecha Pago Mes',
		cell: ({ row }) =>
			moment(row.getValue('fechaPagoMes')).format('DD/MM/YYYY'),
		filterFn: (row, columnId, filterValue) => {
			if (!filterValue) return true; // Si no hay filtro, muestra todas las filas.

			const rowDate = moment(row.original.fechaPagoMes, 'YYYY-MM-DD');
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
		accessorKey: 'fechaPagoRecibo',
		header: 'Fecha Pago Recibo',
		cell: ({ row }) =>
			moment(row.getValue('fechaPagoRecibo')).format('DD/MM/YYYY'),
		filterFn: (row, columnId, filterValue) => {
			if (!filterValue) return true; // Si no hay filtro, muestra todas las filas.

			const rowDate = moment(row.original.fechaPagoRecibo, 'YYYY-MM-DD');
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
		accessorKey: 'plan',
		header: 'Plan',
		cell: ({ row }) => (row.original.plan ? row.original.plan.nombre : '--'),
	},
	{
		accessorKey: 'plan',
		header: 'Precio Plan',
		cell: ({ row }) =>
			row.original.plan ? row.original.plan.precioFinal : '--',
	},
	{
		accessorKey: 'estadoPago',
		header: 'Estado Pago',
		cell: ({ row }) => {
			const estado = row.original.estadoPago;
			return (
				<span
					className={`px-2 py-1 rounded text-white ${
						estado === 'COMPLETADO'
							? 'bg-green-500'
							: estado === 'INCOMPLETO'
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
		accessorKey: 'tipoPago',
		header: 'Tipo Pago',
		cell: ({ row }) => {
			const estado = row.original.tipoPago;
			return (
				<span
					className={`px-2 py-1 rounded text-white ${
						estado === 'CUOTA_MENSUAL'
							? 'bg-blue-500'
							: estado === 'GRADUACION'
							? 'bg-yellow-200-500'
							: estado === 'MATRICULA'
							? 'bg-orange-500'
							: estado === 'OTRO'
							? 'bg-gray-500' // Aquí asigné un color por defecto para 'OTROS'
							: 'bg-black-200' // Un color predeterminado por si no coincide con ninguna opción
					}`}
				>
					{estado}
				</span>
			);
		},
	},
	{
		accessorKey: 'pagador',
		header: 'Pagador',
		cell: ({ row }) => row.original.pagador.nombre,
		// Filtro personalizado para buscar por el nombre del estudiante
		filterFn: (row, columnId, value) => {
			// Si el nombre del estudiante contiene el valor de búsqueda (insensible a mayúsculas/minúsculas)
			return row.original.pagador.nombre
				.toLowerCase()
				.includes(value.toLowerCase());
		},
	},
	{
		accessorKey: 'beneficiarios',
		header: 'Beneficiarios',
		cell: ({ row }) =>
			row.original.beneficiarios
				.map(beneficiario => beneficiario.nombre)
				.join(', '),
	},
	{
		accessorKey: 'comentario',
		header: 'Comentario',
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
