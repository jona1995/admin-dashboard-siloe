'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadButton } from '@/utils/uploadthing';
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
import { FormCreateCustomerProps } from './FormCreateCustomer.type';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
	name: z.string(),
	country: z.string().min(2),
	website: z.string().min(2),
	phone: z.string().min(6),
	cif: z.string().min(6),
	profileImage: z.string(),
});

export function FormCreateCustomer(props: FormCreateCustomerProps) {
	const { setOpenModalCreate } = props;
	const router = useRouter();
	const [photoUploaded, setPhotoUploaded] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			country: '',
			website: '',
			phone: '',
			cif: '',
			profileImage: '',
		},
	});
	const { isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			axios.post('/api/company', values);
			toast({ title: 'Company created' });
			router.refresh();
			setOpenModalCreate(false);
		} catch (error) {
			toast({ title: 'Something went wrong', variant: 'destructive' });
		}
	};
	return (
		<div>
			{' '}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company name</FormLabel>
									<FormControl>
										<Input placeholder="Company name" type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel>country </FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="select the country" />
												<SelectContent>
													<SelectItem value="spain">España</SelectItem>
													<SelectItem value="united-kingdom">
														United Kingdom
													</SelectItem>
													<SelectItem value="portugal">Portugal</SelectItem>
													<SelectItem value="grecia">Grecia</SelectItem>
													<SelectItem value="italia">Italia</SelectItem>
												</SelectContent>
											</SelectTrigger>
										</FormControl>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="website"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Website</FormLabel>
									<FormControl>
										<Input
											placeholder="www.tarraga.com"
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
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input
											placeholder="+34 655 55 55 55"
											type="number"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="cif"
							render={({ field }) => (
								<FormItem>
									<FormLabel>CIF</FormLabel>
									<FormControl>
										<Input placeholder="B-45333" type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="profileImage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Profile Image</FormLabel>
									<FormControl>
										{photoUploaded ? (
											<p className="text-sm">Image uploaded!</p>
										) : (
											<UploadButton
												className="bg-slate-600/20 text-slate-800 rounded-lg outline-dotted outline-3"
												{...field}
												endpoint="profileImage"
												onClientUploadComplete={res => {
													form.setValue('profileImage', res?.[0].url);
													toast({ title: 'Photo uploaded!' });
													setPhotoUploaded(true);
												}}
												onUploadError={(error: Error) => {
													toast({ title: 'Error uploading photo' });
												}}
											/>
										)}
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button type="submit" disabled={!isValid}>
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
}
