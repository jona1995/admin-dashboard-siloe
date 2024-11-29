'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { FormCreateCustomer } from '../FormCreateCustomer/FormCreateCustomer';

export function HeaderCompanies() {
	const [openModalCreate, setOpenModalCreate] = useState(false);
	return (
		<div className="flex justify-between items-center">
			<h2 className="text-2xl">List of Companies</h2>
			<Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
				<DialogTrigger asChild>
					<Button>Create Company</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[625px]">
					<DialogHeader>
						<DialogTitle>Create Customer</DialogTitle>
						<DialogDescription>
							Create and Configure your customer
						</DialogDescription>
					</DialogHeader>
					<FormCreateCustomer setOpenModalCreate={setOpenModalCreate} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
