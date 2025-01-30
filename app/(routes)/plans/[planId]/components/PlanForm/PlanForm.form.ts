import { Item } from '@radix-ui/react-select';
import { z } from 'zod';

export const formSchema = z.object({
	nombre: z.string().min(1, { message: 'El nombre es obligatorio.' }),
	descripcion: z.string(),
	precioFinal: z.number().min(1, { message: 'El precio es obligatorio.' }),
	items: z.array(
		z.object({
			cursoId: z.string(),
			cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
			descuento: z
				.number()
				.min(0)
				.max(100, 'El descuento debe estar entre 0 y 100'),
		})
	),
});
