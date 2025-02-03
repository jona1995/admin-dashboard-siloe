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
		filterFn: (row, columnId, filterValue) => {
			if (!filterValue) return true; // Si no hay filtro, muestra todas las filas.

			const rowDate = moment(row.original.fechaInscripcion, 'YYYY-MM-DD');
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
		accessorKey: 'fechaInscripcionCursoDesde',
		header: 'Fecha Inscripcion Desde',
		cell: ({ row }) =>
			moment(row.getValue('fechaInscripcionCursoDesde')).format('DD/MM/YYYY'),
		filterFn: (row, columnId, filterValue) => {
			if (!filterValue) return true; // Si no hay filtro, muestra todas las filas.

			const rowDate = moment(
				row.original.fechaInscripcionCursoDesde,
				'YYYY-MM-DD'
			);
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
		accessorKey: 'fechaInscripcionCursoHasta',
		header: 'Fecha Inscripcion Hasta',
		cell: ({ row }) =>
			row.getValue('fechaInscripcionCursoHasta')
				? moment(row.getValue('fechaInscripcionCursoHasta')).format(
						'DD/MM/YYYY'
				  )
				: '',
		filterFn: (row, columnId, filterValue) => {
			if (!filterValue) return true; // Si no hay filtro, muestra todas las filas.

			const rowDate = moment(
				row.original.fechaInscripcionCursoHasta,
				'YYYY-MM-DD'
			);
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
		accessorKey: 'estudianteId',
		header: 'Estudiante',
		cell: ({ row }) =>
			row.original.user.nombre + ' ' + row.original.user.apellido,
		// Filtro personalizado para buscar por el nombre del estudiante
		filterFn: (row, columnId, value) => {
			// Si el nombre del estudiante contiene el valor de búsqueda (insensible a mayúsculas/minúsculas)
			return row.original.user.nombre
				.toLowerCase()
				.includes(value.toLowerCase());
		},
	},
	{
		accessorKey: 'courseNames',
		header: 'Curso',
		// enableSorting: false, // Habilitar ordenación para esta columna
	},
	{
		accessorKey: 'estado',
		header: 'Estado',
		cell: ({ row }) => {
			const estado = row.original.estado;
			return (
				<span
					className={`px-2 py-1 rounded text-white ${
						estado === 'ACTIVO'
							? 'bg-yellow-500'
							: estado === 'INACTIVO'
							? 'bg-red-500'
							: 'bg-green-500'
					}`}
				>
					{estado}
				</span>
			);
		},
		filterFn: (row, columnId, filterValue) => {
			return row.getValue(columnId) === filterValue; // Comparación exacta
		},
	},
	{
		accessorKey: 'planId',
		header: 'Plan',
		cell: ({ row }) => (row.original.plan ? row.original.plan.nombre : ''),
	},
	{
		accessorKey: 'modalidad',
		header: 'Modalidad',
		cell: ({ row }) => {
			const estado = row.original.modalidad;
			return (
				<span
					className={`px-2 py-1 rounded text-white ${
						estado === 'EN_CLASE'
							? 'bg-teal-600'
							: estado === 'GRABADO'
							? 'bg-blue-800'
							: 'bg-gray-500'
					}`}
				>
					{estado}
				</span>
			);
		},
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
