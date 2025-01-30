import { z } from 'zod';

export const formSchema = z.object({
	descripcion: z
		.string()
		.min(1, { message: 'La descrippcion es obligatorio.' }),
	tipo: z.string().min(1, { message: 'El tipo es obligatorio.' }),
	monto: z.string().min(1, { message: 'El monto es obligatorio.' }),
	fecha: z.date({
		required_error: 'La fecha  es obligatoria.',
	}),
});
