'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormCreateCustomerProps } from './FormCreateCustomer.types';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { TransactionType } from '../../utils/enum';

const formSchema = z.object({
	descripcion: z.string(),
	tipo: z.string(),
	monto: z.string(),
	fecha: z.date(),
});

export function FormCreateCustomer(props: FormCreateCustomerProps) {
	const { setOpenModalCreate } = props;
	const router = useRouter();
	const [transactionType, setTransactionType] = useState<TransactionType>(
		TransactionType.INGRESO
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			descripcion: '',
			tipo: '',
			monto: undefined,
			fecha: undefined,
		},
	});

	const { isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			console.log(values);
			await axios.post('/api/financialTransaction', values);
			toast({ title: 'Cuenta creada' });
			setOpenModalCreate(false);
			router.refresh();
		} catch (error) {
			toast({
				title: 'Something went wrong',
				variant: 'destructive',
			});
		}
	};

	return (
		<div>
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
										<Input
											placeholder="Descripcion..."
											type="text"
											{...field}
										/>
									</FormControl>
									<FormMessage />
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
													? new Date(field.value).toISOString().split('T')[0]
													: ''
											}
											onChange={e =>
												field.onChange(
													e.target.value ? new Date(e.target.value) : undefined
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button type="submit" disabled={!isValid}>
						Enviar
					</Button>
				</form>
			</Form>
		</div>
	);
}
