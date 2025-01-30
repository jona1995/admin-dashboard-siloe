'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { StudentInformationDetailProps } from './StudentInformationDetail.types';
import { useState } from 'react';

export function StudentInformationDetail(props: StudentInformationDetailProps) {
	const { student } = props;
	const [activeTab, setActiveTab] = useState<string>('info');
	return (
		<div className="p-6 space-y-4">
			{/* Tabs Header */}
			<div className="flex border-b border-gray-200">
				<button
					className={`py-2 px-4 text-sm font-semibold ${
						activeTab === 'info' ? 'border-b-2 border-blue-500' : ''
					}`}
					onClick={() => setActiveTab('info')}
				>
					Información del Estudiante
				</button>
				<button
					className={`py-2 px-4 text-sm font-semibold ${
						activeTab === 'enrollments' ? 'border-b-2 border-blue-500' : ''
					}`}
					onClick={() => setActiveTab('enrollments')}
				>
					Inscripciones
				</button>
				<button
					className={`py-2 px-4 text-sm font-semibold ${
						activeTab === 'evaluations' ? 'border-b-2 border-blue-500' : ''
					}`}
					onClick={() => setActiveTab('evaluations')}
				>
					Evaluaciones
				</button>
				<button
					className={`py-2 px-4 text-sm font-semibold ${
						activeTab === 'paymentsMade' ? 'border-b-2 border-blue-500' : ''
					}`}
					onClick={() => setActiveTab('paymentsMade')}
				>
					Pagos Realizados
				</button>
				<button
					className={`py-2 px-4 text-sm font-semibold ${
						activeTab === 'paymentsReceived' ? 'border-b-2 border-blue-500' : ''
					}`}
					onClick={() => setActiveTab('paymentsReceived')}
				>
					Pagos Recibidos
				</button>
				<button
					className={`py-2 px-4 text-sm font-semibold ${
						activeTab === 'plan' ? 'border-b-2 border-blue-500' : ''
					}`}
					onClick={() => setActiveTab('plan')}
				>
					Plan del Estudiante
				</button>
			</div>

			{/* Tabs Content */}
			{activeTab === 'info' && (
				<section className="py-4">
					<h2 className="text-xl font-bold mb-2">Información del Estudiante</h2>
					<p>
						<strong>Nombre:</strong> {student.nombre} {student.apellido}
					</p>
					<p>
						<strong>Email:</strong> {student.email}
					</p>
				</section>
			)}

			{activeTab === 'enrollments' && (
				<section className="py-4">
					<h2 className="text-xl font-bold mb-2">Inscripciones</h2>
					<ul>
						{student.enrollments.map(enrollment => (
							<li key={enrollment.id} className="mb-4">
								<p>
									<strong>Fecha de Inscripción:</strong>{' '}
									{new Date(enrollment.createdAt).toLocaleDateString()}
								</p>

								{/* Iterar sobre los cursos de la inscripción */}
								<div>
									<strong>Curso(s):</strong>
									<ul>
										{enrollment.courses.map(course => (
											<li key={course.name}>
												{course.name} {/* Aquí accedes al nombre del curso */}
											</li>
										))}
									</ul>
								</div>
							</li>
						))}
					</ul>
				</section>
			)}

			{activeTab === 'evaluations' && (
				<section className="py-4">
					<h2 className="text-xl font-bold mb-2">Evaluaciones</h2>
					<ul>
						{student.evaluations.map(evaluation => (
							<li key={evaluation.id} className="mb-4">
								<p>
									<strong>Materia:</strong> {evaluation.nombre}
								</p>
								<p>
									<strong>Calificación:</strong> {evaluation.nota}
								</p>
							</li>
						))}
					</ul>
				</section>
			)}

			{activeTab === 'paymentsMade' && (
				<section className="py-4">
					<h2 className="text-xl font-bold mb-2">Pagos Realizados</h2>
					<ul>
						{student.paymentsMade.map(payment => (
							<li key={payment.id} className="mb-4">
								<p>
									<strong>Fecha:</strong>{' '}
									{payment.fechaPagoMes.toLocaleDateString()}
								</p>
								<p>
									<strong>Valor:</strong> ${payment.monto}
								</p>
							</li>
						))}
					</ul>
				</section>
			)}

			{activeTab === 'paymentsReceived' && (
				<section className="py-4">
					<h2 className="text-xl font-bold mb-2">Pagos Recibidos</h2>
					<ul>
						{student.paymentsReceived.map(payment => (
							<li key={payment.id} className="mb-4">
								<p>
									<strong>Fecha:</strong>{' '}
									{payment.fechaPagoMes.toLocaleDateString()}
								</p>
								<p>
									<strong>Valor:</strong> ${payment.monto}
								</p>
							</li>
						))}
					</ul>
				</section>
			)}

			{activeTab === 'plan' && (
				<section className="py-4">
					<h2 className="text-xl font-bold mb-2">Plan del Estudiante</h2>
					<p>
						<strong>Tipo de Plan:</strong> {student.planFijoId}
					</p>
					{/* Puedes añadir más detalles sobre el plan, si están disponibles */}
				</section>
			)}
		</div>
	);
}
