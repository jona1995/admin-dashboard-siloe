import { Payment } from '@prisma/client';

// export type PaymentInformationProps = {
// 	payment: Payment;
// };

type PaymentWithBeneficiarios = Payment & {
	beneficiarios: { id: number; nombre: string }[];
};

export type PaymentInformationProps = {
	payment: PaymentWithBeneficiarios;
};
