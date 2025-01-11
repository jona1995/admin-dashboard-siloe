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
			beneficiarios: true, // Incluye los beneficiarios
		},
	});

	if (!payment) {
		return redirect('/');
	}

	return (
		<div>
			<Header />
			<PaymentInformation payment={payment} />
			<PaymentFooter paymentId={payment.id} />
		</div>
	);
}
