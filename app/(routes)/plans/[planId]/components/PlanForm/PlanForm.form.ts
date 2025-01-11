import { z } from 'zod';

export const formSchema = z.object({
	nombre: z.string(),
	descripcion: z.string(),
	precioBase: z.number(),
	cantidadDiplomaturas: z.number(),
	cantidadBachilleratos: z.number(),
	precioDiplomatura: z.number(),
	precioBachillerato: z.number(),
});
