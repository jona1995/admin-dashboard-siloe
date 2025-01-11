import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Header } from './components/Header';
import { EnrollmentInformation } from './components/Enrollmentnformation';
import { EnrollmentFooter } from './components/EnrollmentFooter';

export default async function EnrollmentIdPage({
	params,
}: {
	params: { enrollmentId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}
	const enrollment = await db.enrollment.findUnique({
		where: {
			id: parseInt(params.enrollmentId, 10),
		},
		include: {
			courses: true, // Incluye los beneficiarios
		},
	});

	if (!enrollment) {
		return redirect('/');
	}

	return (
		<div>
			<Header />
			<EnrollmentInformation enrollment={enrollment} />
			<EnrollmentFooter enrollmentId={enrollment.id} />
		</div>
	);
}
