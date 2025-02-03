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
import { EstadoPago, TipoPago } from '../../utils/enum';

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
					value={
						(table.getColumn('fechaPagoMes')?.getFilterValue() as string) ?? ''
					}
					onChange={event => {
						const fromDate = event.target.value;
						table.getColumn('fechaPagoMes')?.setFilterValue(fromDate);
					}}
				/>
				<Input
					placeholder="Filtrar por estudiante..."
					value={(table.getColumn('pagador')?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn('pagador')?.setFilterValue(event.target.value)
					}
				/>
				<Input
					placeholder="Filtrar por estado..."
					value={
						(table.getColumn('estadoPago')?.getFilterValue() as string) ?? ''
					}
					onChange={event =>
						table.getColumn('estadoPago')?.setFilterValue(event.target.value)
					}
				/>
				<select
					name="estadoPago"
					value={
						(table.getColumn('estadoPago')?.getFilterValue() as string) ?? ''
					}
					onChange={event =>
						table.getColumn('estadoPago')?.setFilterValue(event.target.value)
					}
					className="border rounded p-2"
				>
					<option value="">Todos</option>
					{Object.values(EstadoPago).map(estado => (
						<option key={estado} value={estado}>
							{estado}
						</option>
					))}
				</select>
				<select
					name="tipoPago"
					value={
						(table.getColumn('tipoPago')?.getFilterValue() as string) ?? ''
					}
					onChange={event =>
						table.getColumn('tipoPago')?.setFilterValue(event.target.value)
					}
					className="border rounded p-2"
				>
					<option value="">Todos</option>
					{Object.values(TipoPago).map(tipo => (
						<option key={tipo} value={tipo}>
							{tipo}
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
			<div className="flex items-center justify-between py-4">
				{/* Selector de filas por página */}
				<div className="flex items-center space-x-2">
					<span>Rows per page:</span>
					<select
						value={table.getState().pagination.pageSize}
						onChange={e => table.setPageSize(Number(e.target.value))}
						className="border rounded p-2"
					>
						{[5, 10, 20, 30, 40, 50, 100].map(pageSize => (
							<option key={pageSize} value={pageSize}>
								{pageSize}
							</option>
						))}
					</select>
				</div>

				{/* Controles de navegación */}
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<span>
						Page {table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</span>
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
		</div>
	);
}
