import { z } from 'zod';

export const formSchema = z.object({
	nombre: z.string(),
	descripcion: z.string(),
	tipo: z.string(),
	fecha: z.date(),
	subjectId: z.string(),
	estudianteId: z.string(),
	nota: z.number(),
	comentario: z.string(),
});
