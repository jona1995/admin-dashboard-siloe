import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Header } from './components/Header';
import { StudentInformation } from './components/StudentInformation';
import { StudentFooter } from './components/StudentFooter';

export default async function StudentIdPage({
	params,
}: {
	params: { studentId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}
	const student = await db.student.findUnique({
		where: {
			id: parseInt(params.studentId, 10),
		},
	});

	if (!student) {
		return redirect('/');
	}

	return (
		<div>
			<Header />
			<StudentInformation student={student} />
			<StudentFooter studentId={student.id} />
		</div>
	);
}
