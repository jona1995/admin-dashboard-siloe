'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';

import { AccountingFormProps } from './AccountingForm.types';
import { formSchema } from './AccountingForm.form';
import { toast } from '@/components/ui/use-toast';
import { TransactionType } from '../../../utils/enum';
import moment from 'moment';

export function AccountingForm(props: AccountingFormProps) {
	const { accounting } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			descripcion: accounting.descripcion || '',
			fecha: accounting.fecha,
			monto: Number(accounting.monto) || 0,
			tipo: accounting.tipo,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/financialTransaction/${accounting.id}`, values);
			toast({
				title: 'Cuenta actualizado!',
			});
			router.refresh();
		} catch (error) {
			toast({
				title: 'Something went wrong',
				variant: 'destructive',
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="descripcion"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Descripcion</FormLabel>
								<FormControl>
									<Input placeholder="Descripcion..." type="text" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="tipo"
						render={({ field }) => {
							// Convertimos los valores del enum a un arreglo
							const tipos = Object.values(TransactionType);

							return (
								<FormItem>
									<FormLabel>Tipo de Cuenta</FormLabel>
									<Select
										onValueChange={value => field.onChange(value)} // Actualizamos el campo con el valor seleccionado
										value={field.value || ''}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Seleccione un tipo" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{/* Estados disponibles */}
											{tipos.map(tipo => (
												<SelectItem key={tipo} value={tipo}>
													{tipo}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="monto"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Monto</FormLabel>
								<FormControl>
									<Input placeholder="Monto..." type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="fecha"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Fecha</FormLabel>
								<FormControl>
									<input
										type="date"
										className="w-full px-3 py-2 border rounded-md"
										value={
											field.value
												? moment(field.value).local().format('YYYY-MM-DD') // Formatear con moment
												: ''
										}
										onChange={e =>
											field.onChange(
												e.target.value
													? moment(e.target.value, 'YYYY-MM-DD').toDate()
													: undefined
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit">Editar Cuenta</Button>
			</form>
		</Form>
	);
}
