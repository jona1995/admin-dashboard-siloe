import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { PaymentFooter } from './components/PaymentFooter';
import { PaymentInformation } from './components/PaymentInformation';
import { Header } from './components/Header';

export default async function PaymentIdPage({
	params,
}: {
	params: { paymentId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}
	const payment = await db.payment.findUnique({
		where: {
			id: parseInt(params.paymentId, 10),
		},
		include: {
			beneficiarios: {
				select: {
					id: true,
					user: {
						select: {
							nombre: true, // Obtener el nombre del user del beneficiario
						},
					},
				},
			},
		},
	});

	if (!payment) {
		return redirect('/');
	}
	// Mapea los beneficiarios para aplanar la estructura
	const formattedBeneficiarios = payment.beneficiarios.map(beneficiario => ({
		id: beneficiario.id,
		nombre: beneficiario.user.nombre, // Mueve 'nombre' al nivel superior
	}));

	// Crea un nuevo objeto 'payment' con los beneficiarios formateados
	const paymentWithFormattedBeneficiarios = {
		...payment,
		beneficiarios: formattedBeneficiarios,
	};
	return (
		<div>
			<Header />
			<PaymentInformation payment={paymentWithFormattedBeneficiarios} />
			<PaymentFooter paymentId={payment.id} />
		</div>
	);
}
