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
import Image from 'next/image';
import { GradeDTO } from '../../utils/type';
type EnrichedData = {
	studentName: string;
	subjectName: string;
	courseName: string;
	promedio: string;
};

export const columns: ColumnDef<EnrichedData>[] = [
	{
		accessorKey: 'studentName',
		header: 'Estudiante',
	},
	{
		accessorKey: 'subjectName',
		header: 'Materia',
	},
	{
		accessorKey: 'courseName',
		header: 'Curso',
	},
	{
		accessorKey: 'promedio',
		header: 'Promedio',
		cell: ({ row }) => {
			const nota = row.original.promedio
				? parseFloat(row.original.promedio)
				: 0; // Obtén la nota
			let colorClass = '';

			// Define los colores según el valor de la nota
			if (nota >= 9) {
				colorClass = 'text-green-500'; // Excelente
			} else if (nota >= 7) {
				colorClass = 'text-blue-500'; // Bueno
			} else if (nota >= 5) {
				colorClass = 'text-yellow-500'; // Regular
			} else {
				colorClass = 'text-red-500'; // Insuficiente
			}

			return <span className={`${colorClass} font-semibold`}>{nota}</span>;
		},
	},
];
