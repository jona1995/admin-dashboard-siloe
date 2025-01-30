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
import { useState } from 'react';

export function HeaderDebtor() {
	const [openModalCreate, setOpenModalCreate] = useState(false);

	return (
		<div className="flex items-center justify-between">
			<h2 className="text-2xl">Deudores</h2>
		</div>
	);
}
