-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INGRESO', 'EGRESO');

-- CreateEnum
CREATE TYPE "ModalidadEstudio" AS ENUM ('EN_CLASE', 'GRABADO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'COMPLETADO', 'FALLADO', 'INCOMPLETO', 'PAGO_PARCIAL');

-- CreateEnum
CREATE TYPE "Saldo" AS ENUM ('SALDO_A_FAVOR', 'SALDO_NEGATIVO', 'SALDO_JUSTO');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('MATRICULA', 'GRADUACION', 'CUOTA_MENSUAL', 'OTRO');

-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoIncripcion" AS ENUM ('ACTIVO', 'INACTIVO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "TipoEvaluacion" AS ENUM ('CALIFICACION_FINAL', 'PARTICIPACION_CLASE', 'LECTURA', 'TAREA', 'EXAMEN', 'PROYECTO_FINAL', 'OTRO');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ESTUDIANTE', 'PROFESOR', 'ADMINISTRATIVO', 'COORDINADOR', 'DIRECTOR', 'ADMINISTRADOR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "iglesia" TEXT NOT NULL,
    "localidadIglesia" TEXT NOT NULL,
    "state" "UserState" NOT NULL,
    "tipo" "UserType" NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "RolUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planFijoId" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanItem" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "duracion" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "cursoId" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" SERIAL NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "fechaInscripcionDesde" TIMESTAMP(3) NOT NULL,
    "fechaInscripcionHasta" TIMESTAMP(3),
    "estado" "EstadoIncripcion" NOT NULL,
    "planId" INTEGER,
    "modalidad" "ModalidadEstudio" NOT NULL,
    "saldoPendiente" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fechaPagoMes" TIMESTAMP(3) NOT NULL,
    "fechaPagoRecibo" TIMESTAMP(3),
    "saldo" "Saldo" NOT NULL,
    "estadoPago" "EstadoPago" NOT NULL,
    "tipoPago" "TipoPago" NOT NULL,
    "pagadorId" INTEGER,
    "beneficiadoId" INTEGER,
    "enrollmentId" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "saldoAnterior" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saldoPosterior" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "planId" INTEGER,
    "studentId" INTEGER,
    "pagoReferenciaId" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioFinal" DOUBLE PRECISION NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" "TipoEvaluacion" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "comentario" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Absence" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,
    "estudianteId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "promedio" DOUBLE PRECISION NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialTransaction" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "tipo" "TransactionType" NOT NULL,
    "descripcion" TEXT,
    "paymentId" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseSubjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EnrollmentCourses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TeacherSubjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_StudentAssociates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PaymentsReceived" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PlanToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AbsenceToSubject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_cedula_key" ON "User"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "RolUser_userId_rolId_key" ON "RolUser"("userId", "rolId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE INDEX "Course_id_idx" ON "Course"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE INDEX "Grade_subjectId_estudianteId_cursoId_idx" ON "Grade"("subjectId", "estudianteId", "cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseSubjects_AB_unique" ON "_CourseSubjects"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseSubjects_B_index" ON "_CourseSubjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EnrollmentCourses_AB_unique" ON "_EnrollmentCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_EnrollmentCourses_B_index" ON "_EnrollmentCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherSubjects_AB_unique" ON "_TeacherSubjects"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherSubjects_B_index" ON "_TeacherSubjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentAssociates_AB_unique" ON "_StudentAssociates"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentAssociates_B_index" ON "_StudentAssociates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentsReceived_AB_unique" ON "_PaymentsReceived"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentsReceived_B_index" ON "_PaymentsReceived"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlanToStudent_AB_unique" ON "_PlanToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_PlanToStudent_B_index" ON "_PlanToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AbsenceToSubject_AB_unique" ON "_AbsenceToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_AbsenceToSubject_B_index" ON "_AbsenceToSubject"("B");
