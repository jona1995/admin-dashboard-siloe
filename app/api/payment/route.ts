import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { EstadoPago, Saldo, TipoPago } from '@prisma/client';
import { AxiosError } from 'axios';
import moment from 'moment';
import { NextResponse } from 'next/server';

const obtenerUltimoPago = async (enrollmentId: number) => {
	return await db.payment.findFirst({
		where: { enrollmentId },
		orderBy: { createdAt: 'desc' }, // Ordenar por fecha de creación descendente
	});
};
// Función para obtener el monto a pagar según si el estudiante tiene un plan o no
const obtenerMontoPorInscripcion = (enrollment: any) => {
	if (!enrollment || !enrollment.courses.length) return 0; // Validación de inscripción

	let montoTotal = 0;

	// Si el estudiante tiene un plan
	if (enrollment.plan) {
		if (enrollment.courses.length > 0) {
			// Si hay un plan y cursos, calcular el monto basado en los cursos dentro del plan
			for (const cursoInscripcion of enrollment.courses) {
				// Buscar el curso en el plan
				const planItem = enrollment.plan.items.find(
					(item: any) => item.curso.id === cursoInscripcion.id
				);

				if (planItem) {
					const cursoPrecio = planItem.curso.precio;
					const descuento = planItem.descuento || 0;
					const precioConDescuento =
						cursoPrecio - cursoPrecio * (descuento / 100);
					montoTotal += precioConDescuento * planItem.cantidad;
				}
			}
		} else {
			// Si hay un plan pero no cursos, usar el precio total del plan
			montoTotal = enrollment.plan.precio || 0;
		}
	} else {
		// Si no hay plan, calcular el monto sumando los precios de los cursos inscritos
		montoTotal = enrollment.courses.reduce(
			(acc: number, curso: { precio: number }) => acc + curso.precio,
			0
		);
	}

	return montoTotal; // Retorna el monto total a pagar por la inscripción
};

const procesarPagoInscripcion = async (
	enrollment: any, // Recibe la inscripción ya obtenida
	montoPago: number,
	fechaPagoMes: string,
	concepto: TipoPago
) => {
	// Paso 1: Validar la inscripción
	if (!enrollment) {
		throw new Error('Inscripción no encontrada');
	}

	// Convertir fechas a objetos Moment con formato DD/MM/YYYY
	const fechaInscripcionCursoDesde = moment(
		enrollment.fechaInscripcionCursoDesde
	);
	const fechaInscripcionCursoHasta = enrollment.fechaInscripcionCursoHasta
		? moment(enrollment.fechaInscripcionCursoHasta)
		: null;

	const fechaPagoMesDate = moment(fechaPagoMes, 'DD/MM/YYYY', true);

	if (!fechaPagoMesDate.isValid()) {
		throw new Error('La fecha de pago proporcionada no es válida.');
	}

	// Validar si la fecha de pago está dentro del rango de inscripción
	if (fechaPagoMesDate.isBefore(fechaInscripcionCursoDesde, 'day')) {
		throw new Error(
			'La fecha de pago no puede ser anterior a la fecha de inscripción.'
		);
	}

	if (
		fechaInscripcionCursoHasta &&
		fechaPagoMesDate.isAfter(fechaInscripcionCursoHasta, 'day')
	) {
		throw new Error(
			'La fecha de pago no puede ser posterior a la fecha límite de inscripción.'
		);
	}

	// Paso 2: Verificar si ya existe un pago para este mes y concepto
	const fechaInicioMes = moment(fechaPagoMes, 'DD/MM/YYYY').startOf('month');
	const fechaFinMes = moment(fechaInicioMes).add(1, 'month');

	const pagoExistente = await db.payment.findFirst({
		where: {
			enrollmentId: enrollment.id,
			tipoPago: concepto,
			fechaPagoMes: {
				gte: fechaInicioMes.toDate(),
				lt: fechaFinMes.toDate(),
			},
		},
	});

	if (pagoExistente) {
		throw new Error(
			`Ya existe un pago para el mes de ${fechaPagoMes} con el concepto ${concepto}.`
		);
	}
	// Paso 3: Obtener el último pago realizado para calcular el saldo anterior
	const ultimoPago = await obtenerUltimoPago(enrollment.id);

	// Si no hay pagos previos, no se puede validar la secuencia de meses, pero si hay, validamos la consecutividad
	if (ultimoPago) {
		// const ultimaFechaPago = new Date(ultimoPago.fechaPagoMes);

		// // Verificar si el mes del último pago es el mes anterior al mes del nuevo pago
		// const mesUltimoPago = ultimaFechaPago.getMonth();
		// const anioUltimoPago = ultimaFechaPago.getFullYear();

		// const mesNuevoPago = fechaPagoMesDate.getMonth();
		// const anioNuevoPago = fechaPagoMesDate.getFullYear();

		// // Si el mes del pago nuevo no es el mes siguiente, lanzar error
		// if (
		// 	mesNuevoPago !== mesUltimoPago + 1 && // Compara el mes, es decir, mes del último pago + 1
		// 	!(
		// 		mesUltimoPago === 11 &&
		// 		mesNuevoPago === 0 &&
		// 		anioNuevoPago === anioUltimoPago + 1
		// 	) // Si diciembre a enero
		// ) {
		// 	throw new Error(
		// 		'Tiene pagos pendientes, El pago debe ser para el mes siguiente al último pago.'
		// 	);
		// }
		const ultimaFechaPago = moment(ultimoPago.fechaPagoMes);

		// Verificar si el nuevo pago es para el mes siguiente
		const diferenciaMeses = moment(fechaPagoMes, 'DD/MM/YYYY').diff(
			ultimaFechaPago,
			'months'
		);

		if (diferenciaMeses !== 1) {
			throw new Error(
				'Tiene pagos pendientes, el pago debe ser para el mes siguiente al último pago.'
			);
		}
	}

	// const saldoAnterior = ultimoPago
	// 	? ultimoPago.saldoPosterior
	// 	: enrollment.saldoPendiente ?? 0; // Si no hay pagos, tomar saldo pendiente

	const saldoAnterior = ultimoPago ? ultimoPago.saldoPosterior : 0; // Si no hay pagos, tomar saldo pendiente

	// Paso 4: Calcular el monto mensual y el saldo pendiente
	const montoMensual = obtenerMontoPorInscripcion(enrollment); // Función para obtener el costo mensual

	// Validar si el pago corresponde al mes de inscripción
	const mesInscripcion = moment(
		fechaInscripcionCursoDesde,
		'DD/MM/YYYY'
	).format('YYYYMM');
	const mesPago = moment(fechaPagoMes, 'DD/MM/YYYY').format('YYYYMM');

	const esMesDeInscripcion = mesInscripcion === mesPago;

	// Si es el mes de inscripción, el saldo pendiente no se suma al monto mensual
	console.log('montoMensual', montoMensual);
	console.log('esMesDeInscripcion', esMesDeInscripcion);
	console.log('saldoAnterior', saldoAnterior);
	const montoPorPagar = esMesDeInscripcion
		? montoMensual - saldoAnterior
		: montoMensual +
		  (saldoAnterior < 0 ? Math.abs(saldoAnterior) : -saldoAnterior);

	console.log('hahaha');
	console.log(enrollment);

	// Paso 5: Calcular el saldo posterior
	let saldoPosterior = 0;
	console.log('saldo anterior', saldoAnterior);
	console.log('montoPago', montoPago);
	console.log('montoPorPagar', montoPorPagar);
	if (saldoAnterior < 0) {
		saldoPosterior = saldoAnterior + montoPago;
	} else {
		saldoPosterior = montoPago - montoPorPagar;
	}
	console.log('saldo posterior', saldoPosterior);
	// Determinar el estado del pago
	let estadoPago: EstadoPago;
	let saldo: Saldo;

	if (saldoPosterior < 0) {
		estadoPago = EstadoPago.INCOMPLETO;
		saldo = Saldo.SALDO_NEGATIVO;
	} else if (saldoPosterior === 0) {
		estadoPago = EstadoPago.COMPLETADO;
		saldo = Saldo.SALDO_JUSTO;
	} else {
		estadoPago = EstadoPago.COMPLETADO;
		saldo = Saldo.SALDO_A_FAVOR;
	}

	return {
		montoMensual,
		montoPorPagar,
		saldoAnterior,
		saldoPosterior,
		estadoPago,
		saldo,
	};
};

export async function POST(req: Request) {
	try {
		const { userId, user } = auth();
		const data = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const userName = req.headers.get('x-user-name');
		const userEmail = req.headers.get('x-user-email');

		const {
			enrollmentId,
			monto: montoTotal,
			fechaPagoMes,
			beneficiarios = [],
		} = data;

		// Si el tipo de pago no es "CUOTA_MENSUAL", registrar el pago directamente
		if (data.tipoPago !== TipoPago.CUOTA_MENSUAL) {
			const paymentAdicional = await db.payment.create({
				data: {
					fechaPagoMes,
					fechaPagoRecibo: data.fechaPagoRecibo
						? new Date(data.fechaPagoRecibo)
						: null,
					tipoPago: data.tipoPago,
					comentario: data.comentario,
					enrollment: {
						connect: { id: enrollmentId },
					},
					createdBy: userId,
					createdByName: userName ? userName : '',
					monto: montoTotal,
					estadoPago: EstadoPago.COMPLETADO, // Se asume que siempre se completa
					saldo: Saldo.SALDO_JUSTO,
					saldoAnterior: 0,
					saldoPosterior: 0,
					pagador: {
						connect: { id: parseInt(data.pagadorId, 10) },
					},
					beneficiarios: {
						connect: beneficiarios.map((id: number) => ({ id })),
					},
				},
			});

			return NextResponse.json({ paymentAdicional });
		}

		// Obtener inscripción solo una vez
		const enrollment = await db.enrollment.findUnique({
			where: { id: enrollmentId },
			include: {
				courses: true,
				plan: {
					include: {
						items: {
							include: {
								curso: true,
							},
						},
					},
				},
			},
		});

		if (!enrollment) {
			throw new Error('Inscripción no encontrada');
		}

		let montoRestante = montoTotal;

		const resultadoPrincipal = await procesarPagoInscripcion(
			enrollment,
			montoTotal,
			fechaPagoMes,
			data.tipoPago
		);

		const paymentPrincipal = await db.payment.create({
			data: {
				fechaPagoMes: data.fechaPagoMes,
				fechaPagoRecibo: data.fechaPagoRecibo
					? new Date(data.fechaPagoRecibo)
					: null,
				createdBy: userId,
				createdByName: userName ? userName : '',
				tipoPago: data.tipoPago,
				comentario: data.comentario,
				enrollment: {
					connect: { id: enrollmentId },
				},
				monto: data.monto,
				estadoPago: resultadoPrincipal.estadoPago,
				saldo: resultadoPrincipal.saldo,
				saldoAnterior: resultadoPrincipal.saldoAnterior,
				saldoPosterior: resultadoPrincipal.saldoPosterior,
				pagador: {
					connect: { id: parseInt(data.pagadorId, 10) },
				},
				beneficiarios:
					beneficiarios.length > 0
						? { connect: beneficiarios.map((id: number) => ({ id })) }
						: { connect: [] },
			},
		});

		// Procesar pagos de beneficiarios
		const pagosBeneficiarios = [];
		console.log('resultado principañ', resultadoPrincipal.saldoPosterior);
		var montoRestanteBeneficiario = resultadoPrincipal.saldoPosterior;

		for (const beneficiarioId of beneficiarios) {
			//monto restante esta siendo el total q ingreso el usuario, sin el descuento
			if (montoRestanteBeneficiario <= 0) {
				throw new Error(
					'El monto restante es insuficiente para procesar el pago de los beneficiarios.'
				);
			}

			// Obtener la inscripción del beneficiario con el mismo plan que el pagador
			const enrollmentBeneficiario = await db.enrollment.findFirst({
				where: {
					estudianteId: beneficiarioId,
					planId: enrollment.planId, // Debe coincidir el plan con el del pagador
					estado: 'ACTIVO', // Solo considerar inscripciones activas
				},
				include: {
					courses: true, // Incluir los cursos en los que está inscrito el beneficiario
					plan: {
						include: {
							items: {
								include: {
									curso: true, // Incluir los cursos del plan
								},
							},
						},
					},
				},
			});

			console.log(enrollmentBeneficiario);
			// Si no se encuentra una inscripción válida, continuar con el siguiente beneficiario
			if (!enrollmentBeneficiario) {
				throw new Error(
					`No se encontró la inscripción del beneficiario con ID: ${beneficiarioId}`
				);
			}

			const resultadoBeneficiario = await procesarPagoInscripcion(
				enrollmentBeneficiario,
				montoRestanteBeneficiario,
				fechaPagoMes,
				data.tipoPago
			);

			// Crear el pago para el beneficiario
			const paymentBeneficiario = await db.payment.create({
				data: {
					fechaPagoMes: data.fechaPagoMes,
					comentario: data.comentario,
					enrollment: {
						connect: { id: enrollmentBeneficiario.id }, // Asignar la inscripción del beneficiario
					},
					createdBy: userId,
					createdByName: userName ? userName : '',
					tipoPago: data.tipoPago,
					monto: resultadoPrincipal.saldoPosterior, // Se usa el monto calculado
					fechaPagoRecibo: data.fechaPagoRecibo
						? new Date(data.fechaPagoRecibo)
						: null,
					estadoPago: resultadoBeneficiario.estadoPago,
					saldo:
						resultadoBeneficiario.saldoPosterior > 0
							? Saldo.SALDO_JUSTO
							: resultadoBeneficiario.saldo,
					saldoAnterior: resultadoBeneficiario.saldoAnterior,
					saldoPosterior:
						resultadoBeneficiario.saldoPosterior > 0
							? 0
							: resultadoBeneficiario.saldoPosterior, // ✅ Se fuerza a cero si era positivo
					pagador: {
						connect: { id: parseInt(data.pagadorId, 10) },
					},
					beneficiado: {
						connect: { id: parseInt(beneficiarioId, 10) },
					},
					beneficiarios: { connect: [] }, // Se mantiene vacío si no hay más beneficiarios
					pagoReferenciaId: paymentPrincipal.id,
				},
			});
			montoRestanteBeneficiario = resultadoBeneficiario.saldoPosterior;
			pagosBeneficiarios.push(paymentBeneficiario);
		}

		console.log('monto final beneficiario');
		console.log(montoRestanteBeneficiario);

		// ✅ Si aún queda saldo a favor del pagador, actualizar su saldo pendiente
		if (montoRestanteBeneficiario >= 0) {
			console.log(
				`Saldo restante de ${montoRestanteBeneficiario} a favor del pagador.`
			);

			await db.payment.update({
				where: { id: paymentPrincipal.id },
				data: {
					saldoPosterior: montoRestanteBeneficiario, // Se reduce el saldo posterior
					saldo:
						montoRestanteBeneficiario === 0
							? Saldo.SALDO_JUSTO
							: Saldo.SALDO_A_FAVOR,
				},
			});
		}

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Pago procesado exitosamente',
			data: paymentPrincipal,
			status: 200,
		});
	} catch (error) {
		// Manejo de excepciones
		if (error instanceof AxiosError) {
			// Si es un error de Axios, obtenemos el mensaje desde la respuesta
			const errorMessage = error.response?.data?.message || 'Error desconocido';

			return NextResponse.json(
				{
					success: false,
					message: errorMessage,
				},
				{ status: error.response?.status || 500 }
			);
		} else if (error instanceof Error) {
			// Si es un error genérico de JavaScript, lo manejamos aquí
			return NextResponse.json(
				{
					success: false,
					message: error.message || 'Error desconocido',
				},
				{ status: 500 }
			);
		}

		// En caso de que no sepamos qué tipo de error es
		return NextResponse.json(
			{
				success: false,
				message: 'Error desconocido',
			},
			{ status: 500 }
		);
	}
}
