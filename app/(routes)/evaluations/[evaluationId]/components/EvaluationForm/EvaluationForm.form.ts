import { z } from 'zod';

export const formSchema = z.object({
	nombre: z.string().min(1, { message: 'El nombre es obligatorio.' }),
	descripcion: z.string(),
	tipo: z.string().min(1, { message: 'El tipo es obligatorio.' }),
	fecha: z.date({
		required_error: 'La fecha  es obligatoria.',
	}),
	teacherId: z.string().min(1, { message: 'La profesor es obligatorio.' }),
	subjectId: z.string().min(1, { message: 'La materia es obligatorio.' }),
	estudianteId: z.string().min(1, { message: 'El estudiante es obligatorio.' }),
	nota: z
		.number()
		.min(1, { message: 'La nota debe ser como mínimo 1.' }) // Valor mínimo
		.max(10, { message: 'La nota debe ser como máximo 10.' }) // Valor máximo
		.refine(val => val !== null, { message: 'La nota es obligatoria.' }), // Asegura que no sea null
	comentario: z.string(),
});
