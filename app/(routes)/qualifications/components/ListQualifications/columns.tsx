'use client';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';

import { Company, Evaluation, Grade } from '@prisma/client';

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
		cell: ({ row }) => (
			<span className="font-semibold">{row.original.promedio}</span>
		),
	},
];
