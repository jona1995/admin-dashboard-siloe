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

import { PlanFormProps } from './PlanForm.types';
import { toast } from '@/components/ui/use-toast';
import { formSchema } from './PlanForm.form';

export function PlanForm(props: PlanFormProps) {
	const { plan } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: plan.nombre,
			descripcion: plan.descripcion,
			precioBase: plan.precioBase,
			cantidadDiplomaturas: plan.cantidadDiplomaturas,
			cantidadBachilleratos: plan.cantidadBachilleratos,
			precioDiplomatura: plan.precioDiplomatura,
			precioBachillerato: plan.precioBachillerato,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/plan/${plan.id}`, values);
			toast({
				title: 'Plan actualizado!',
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
									<Input placeholder="Descripcion..." type="text" {...field} />
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
				<Button type="submit">Editar Estudiante</Button>
			</form>
		</Form>
	);
}
