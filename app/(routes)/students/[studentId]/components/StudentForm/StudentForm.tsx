'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
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

import { StudentFormProps } from './StudentForm.types';
import { formSchema } from './StudentForm.form';
import { toast } from '@/components/ui/use-toast';

export function StudentForm(props: StudentFormProps) {
	const { student } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: student.user.nombre,
			apellido: student.user.apellido,
			cedula: student.user.cedula,
			telefono: student.user.telefono,
			email: student.user.email,
			iglesia: student.user.iglesia,
			localidadIglesia: student.user.localidadIglesia,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await axios.patch(`/api/user/${student.id}`, values);
			if (response.status === 200) {
				// Aquí obtienes el mensaje de éxito de la API y lo muestras con el toast
				const successMessage =
					response.data.message || 'Estudiante realizado con éxito';

				toast({
					title: successMessage,
				});

				router.refresh(); // Refrescar la página para obtener los datos actualizados
			} else {
				// Si no es un 200, puedes manejarlo aquí como un error
				throw new Error('Hubo un problema con el estudiante');
			}
		} catch (error) {
			// Asegurarse de que `error` es un AxiosError
			if (error instanceof AxiosError) {
				const errorMessage = error.response?.data?.message || 'Algo salió mal';

				toast({
					title: errorMessage, // Mostrar el mensaje de error recibido desde la API
					variant: 'destructive',
				});
			} else {
				toast({
					title: 'Something went wrong',
					variant: 'destructive',
				});
			}
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
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="apellido"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Apellidos</FormLabel>
								<FormControl>
									<Input placeholder="Apellidos..." type="text" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="cedula"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cedula</FormLabel>
								<FormControl>
									<Input placeholder="Cedula..." type="text" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="telefono"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Telefono</FormLabel>
								<FormControl>
									<Input placeholder="Telefono" type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Email" type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="iglesia"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Iglesia</FormLabel>
								<FormControl>
									<Input placeholder="Iglesia" type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="localidadIglesia"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Localidad Iglesia</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Localidad Iglesia..."
										{...field}
										value={form.getValues().localidadIglesia ?? ''}
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
