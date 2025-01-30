import { z } from 'zod';

export const formSchema = z.object({
	nombre: z.string().min(1, { message: 'El nombre es obligatorio.' }),
	descripcion: z.string(),
	duracion: z.number().min(1, { message: 'La duracion es obligatorio.' }),
	precio: z.number().min(1, { message: 'El precio es obligatorio.' }),
	subjects: z.array(z.string()),
});
