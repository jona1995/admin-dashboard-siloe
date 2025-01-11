import { Payment } from '@prisma/client';

// export type PaymentFormProps = {
// 	payment: Payment;
// };

type PaymentWithBeneficiarios = Payment & {
	beneficiarios: { id: number; nombre: string }[];
};

export type PaymentFormProps = {
	payment: PaymentWithBeneficiarios;
};
