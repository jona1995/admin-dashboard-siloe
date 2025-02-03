import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { HeaderDetail } from './components/HeaderDetail';
import { StudentInformationDetail } from './components/StudentInformationDetail';

export default async function DetailIdPage({
	params,
}: {
	params: { studentId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	console.log(params.studentId);
	const student = await db.student.findUnique({
		where: {
			id: parseInt(params.studentId, 10),
		},
		include: {
			enrollments: {
				include: {
					courses: true, // Obtener los cursos
				},
			},
			user: true, // Incluir la relación de Usuario con el Estudiante
			evaluations: true,
			paymentsMade: true,
			paymentsReceived: true,
			plan: true,
		},
	});

	if (!student) {
		return redirect('/');
	}
	console.log(student);
	// Transformar los cursos a la estructura esperada
	const enrollmentsWithCourses = student.enrollments.map(enrollment => ({
		...enrollment,
		courses: enrollment.courses.map(course => ({
			name: course.nombre, // Mapear 'nombre' a 'name'
			description: course.descripcion || '', // Mapear 'descripcion' a 'description'
		})),
	}));
	return (
		<div>
			<HeaderDetail />
			{/* <StudentInformationDetail student={student} /> */}
		</div>
	);
}
