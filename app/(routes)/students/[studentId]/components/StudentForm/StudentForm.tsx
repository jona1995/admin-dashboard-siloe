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

import { StudentFormProps } from './StudentForm.types';
import { formSchema } from './StudentForm.form';
import { toast } from '@/components/ui/use-toast';

export function StudentForm(props: StudentFormProps) {
	const { student } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: student.nombre,
			apellido: student.apellido,
			cedula: student.cedula,
			telefono: student.telefono,
			email: student.email,
			iglesia: student.iglesia,
			localidadIglesia: student.localidadIglesia,
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/user/${student.id}`, values);
			toast({
				title: 'Estudiante actualizado!',
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
