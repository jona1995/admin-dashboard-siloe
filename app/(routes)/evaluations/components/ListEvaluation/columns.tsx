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
import { Evaluation, NotaEstado, NotaEstadoEnum } from '../../utils/enum';

export const columns: ColumnDef<Evaluation>[] = [
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
		accessorKey: 'nombre',
		header: 'Evaluacion',
	},
	{
		accessorKey: 'estudianteId',
		header: 'Estudiante',
		cell: ({ row }) => row.original.student.user.nombre,
		// Filtro personalizado para buscar por el nombre del estudiante
		filterFn: (row, columnId, value) => {
			// Si el nombre del estudiante contiene el valor de búsqueda (insensible a mayúsculas/minúsculas)
			return row.original.student.user.nombre
				.toLowerCase()
				.includes(value.toLowerCase());
		},
	},

	{
		accessorKey: 'tipo',
		header: 'Tipo',
	},

	{
		accessorKey: 'subjectId',
		header: 'Materia',
		cell: ({ row }) => row.original.subject.nombre,
		// Filtro personalizado para buscar por el nombre del estudiante
		filterFn: (row, columnId, value) => {
			// Si el nombre del estudiante contiene el valor de búsqueda (insensible a mayúsculas/minúsculas)
			return row.original.subject.nombre
				.toLowerCase()
				.includes(value.toLowerCase());
		},
	},
	{
		accessorKey: 'nota',
		header: 'Nota',
		cell: ({ row }) => {
			const nota = row.original.nota; // Obtén la nota
			let colorClass = '';

			// Define los colores según el valor de la nota
			if (nota >= 6 && nota <= 10) {
				colorClass = 'text-green-500'; // Excelente
			} else if (nota < 6) {
				colorClass = 'text-red-500'; // Bueno
			} else {
				colorClass = 'text-yellow-500'; // Insuficiente
			}

			return (
				<span className={`${colorClass} font-semibold text-right `}>
					{nota}
				</span>
			);
		},
	},
	{
		accessorKey: 'nota',
		header: 'Resultado Nota',
		cell: ({ row }) => {
			const nota = row.original.nota; // Obtén la nota
			const estado = nota >= 6 ? NotaEstado.APROBADO : NotaEstado.DESAPROBADO;

			return (
				<div className="flex items-center justify-end space-x-2">
					<span
						className={`px-2 py-1 rounded text-sm font-medium ${estado.colorClass}`}
					>
						{estado.label}
					</span>
				</div>
			);
		},
		// Aquí aplicamos un filtro que convierte el valor de nota en texto.
		filterFn: (row, columnId, value) => {
			const nota = row.original.nota;
			const estado =
				nota >= 6 ? NotaEstadoEnum.APROBADO : NotaEstadoEnum.DESAPROBADO;
			return estado === value;
		},
	},
	{
		accessorKey: 'descripcion',
		header: 'Descripcion',
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
