import { Plan } from '@prisma/client';

type PlanWithItems = Plan & {
	items: {
		cursoId: string;
		cantidad: number;
		descuento: number;
	}[];
};

export type PlanInformationProps = {
	plan: PlanWithItems; // Modificado para incluir items
};
