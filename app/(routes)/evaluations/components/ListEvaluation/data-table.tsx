'use client';

import React from 'react';

import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
	getPaginationRowModel,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NotaEstado, NotaEstadoEnum, Tipo } from '../../utils/enum';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [isMounted, setIsMounted] = React.useState(false);

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	if (!isMounted) {
		return null;
	}

	return (
		<div className="p-4 mt-4 rounded-lg shadow-md bg-background">
			<div className="flex items-center mb-2 space-x-4">
				<Input
					name="fechaDesde"
					placeholder="Fecha desde..."
					value={(table.getColumn('fecha')?.getFilterValue() as string) ?? ''}
					onChange={event => {
						const fromDate = event.target.value;
						table.getColumn('fecha')?.setFilterValue(fromDate);
					}}
				/>
				<Input
					name="estudianteId"
					placeholder="Filtrar por estudiante..."
					value={
						(table.getColumn('estudianteId')?.getFilterValue() as string) ?? ''
					}
					onChange={event =>
						table.getColumn('estudianteId')?.setFilterValue(event.target.value)
					}
				/>
				<Input
					name="estudianteId"
					placeholder="Filtrar por materia..."
					value={
						(table.getColumn('subjectId')?.getFilterValue() as string) ?? ''
					}
					onChange={event =>
						table.getColumn('subjectId')?.setFilterValue(event.target.value)
					}
				/>
				<Input
					placeholder="Filtrar por nombre..."
					value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn('nombre')?.setFilterValue(event.target.value)
					}
				/>

				<select
					name="tipo"
					value={(table.getColumn('tipo')?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn('tipo')?.setFilterValue(event.target.value)
					}
					className="border rounded p-2"
				>
					<option value="">Todos</option>
					{Object.values(Tipo).map(tipo => (
						<option key={tipo} value={tipo}>
							{tipo}
						</option>
					))}
				</select>
				<select
					name="tipo"
					value={(table.getColumn('nota')?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn('nota')?.setFilterValue(event.target.value)
					}
					className="border rounded p-2"
				>
					<option value="">Todos</option>
					{Object.values(NotaEstadoEnum).map(estado => (
						<option key={estado} value={estado}>
							{estado}
						</option>
					))}
				</select>
			</div>
			<div className="border rounded-md">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : header.column.getCanSort() ? (
											<div
												onClick={header.column.getToggleSortingHandler()}
												className="cursor-pointer flex items-center"
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{header.column.getIsSorted() === 'asc' && (
													<span className="ml-2">⬆️</span> // Icono para orden ascendente
												)}
												{header.column.getIsSorted() === 'desc' && (
													<span className="ml-2">⬇️</span> // Icono para orden descendente
												)}
												{header.column.getIsSorted() === false && (
													<span className="ml-2">↕️</span> // Icono por defecto (ordenable)
												)}
											</div>
										) : (
											flexRender(
												header.column.columnDef.header,
												header.getContext()
											)
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end py-4 space-x-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
