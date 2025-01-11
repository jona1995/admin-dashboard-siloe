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

const formSchema = z.object({
	nombre: z.string(),
	descripcion: z.string(),
	precioBase: z.number(),
	cantidadDiplomaturas: z.number(),
	cantidadBachilleratos: z.number(),
	precioDiplomatura: z.number(),
	precioBachillerato: z.number(),
});

export function FormCreateCustomer(props: FormCreateCustomerProps) {
	const { setOpenModalCreate } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: '',
			descripcion: '',
			precioBase: undefined,
			cantidadDiplomaturas: undefined,
			cantidadBachilleratos: undefined,
			precioDiplomatura: undefined,
			precioBachillerato: undefined,
		},
	});
	const { isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post('/api/plan', values);
			toast({ title: 'Plan Creado' });
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
							name="nombre"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombres</FormLabel>
									<FormControl>
										<Input placeholder="Nombres..." type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
							name="precioBase"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Precio</FormLabel>
									<FormControl>
										<Input
											placeholder="Precio..."
											type="text"
											{...field}
											onChange={e =>
												field.onChange(
													e.target.value ? Number(e.target.value) : undefined
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="cantidadDiplomaturas"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cantidad Diplomaturas</FormLabel>
									<FormControl>
										<Input
											placeholder="Cantidad Diplomaturas"
											type="number"
											{...field}
											onChange={e =>
												field.onChange(
													e.target.value ? Number(e.target.value) : undefined
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="precioDiplomatura"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Precio Diplomatura</FormLabel>
									<FormControl>
										<Input
											placeholder="Precio Diplomatura"
											type="number"
											{...field}
											onChange={e =>
												field.onChange(
													e.target.value ? Number(e.target.value) : undefined
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="cantidadBachilleratos"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cantidad Bachilleratos</FormLabel>
									<FormControl>
										<Input
											placeholder="Cantidad Bachilleratos"
											type="number"
											{...field}
											onChange={e =>
												field.onChange(
													e.target.value ? Number(e.target.value) : undefined
												)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="precioBachillerato"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Precio Bachillerato</FormLabel>
									<FormControl>
										<Input
											placeholder="Precio Bachillerato"
											type="number"
											{...field}
											onChange={e =>
												field.onChange(
													e.target.value ? Number(e.target.value) : undefined
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
