'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
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
import { UploadButton } from '@/utils/uploadthing';
import { Button } from '@/components/ui/button';
import { CompanyFormProps } from './CompanyForm.types';
import { formSchema } from './CompanyForm.form';

export function CompanyForm(props: CompanyFormProps) {
	const { company } = props;
	const router = useRouter();

	const [photoUploaded, setPhotoUploaded] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: company.name,
			description: company.description,
			country: company.country,
			website: company.website,
			phone: company.phone,
			cif: company.cif,
			profileImage: company.profileImage,
		},
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/company/${company.id}`, values);
			toast({
				title: 'Company updated!',
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
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company name</FormLabel>
								<FormControl>
									<Input placeholder="Company name..." type="text" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="country"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Country</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select country" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="spain">España</SelectItem>
										<SelectItem value="united-kingdon">
											United Kingdon
										</SelectItem>
										<SelectItem value="portugal">Portugal</SelectItem>
										<SelectItem value="gracia">Gracia</SelectItem>
										<SelectItem value="italia">Italia</SelectItem>
									</SelectContent>
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
									<Input placeholder="www.website.com" type="text" {...field} />
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
										placeholder="+34 424 23 55 22"
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
									<Input placeholder="B-12345" type="text" {...field} />
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
								<FormLabel>Profile image</FormLabel>
								<FormControl>
									<div>
										{photoUploaded ? (
											<p className="text-sm">Image uploaded!</p>
										) : (
											<UploadButton
												className="bg-slate-600/20 text-slate-800 rounded-lg outline-dotted outline-3"
												{...field}
												endpoint="profileImage"
												onClientUploadComplete={res => {
													form.setValue('profileImage', res?.[0].url);
													setPhotoUploaded(true);
												}}
												onUploadError={(error: Error) => {
													toast({ title: 'Errpr uploading photo' });
												}}
											/>
										)}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Description..."
										{...field}
										value={form.getValues().description ?? ''}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit">Edit company</Button>
			</form>
		</Form>
	);
}
