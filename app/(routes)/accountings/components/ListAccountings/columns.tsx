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
	},
	{
		accessorKey: 'descripcion',
		header: 'Descripcion',
	},
	{
		accessorKey: 'monto',
		header: 'Monto',
	},
	{
		accessorKey: 'tipo',
		header: 'Tipo',
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
	},
];
