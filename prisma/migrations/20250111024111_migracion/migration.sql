-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INGRESO', 'EGRESO');

-- CreateEnum
CREATE TYPE "ModalidadEstudio" AS ENUM ('EN_CLASE', 'GRABADO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'COMPLETADO', 'FALLADO', 'INCOMPLETO');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('MATRICULA', 'GRADUACION', 'CUOTA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoIncripcion" AS ENUM ('ACTIVO', 'INACTIVO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "TipoEvaluacion" AS ENUM ('PARTICIPACION_CLASE', 'LECTURA', 'TAREA', 'EXAMEN', 'PROYECTO_FINAL', 'OTRO');

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "iglesia" TEXT NOT NULL,
    "localidadIglesia" TEXT NOT NULL,
    "planFijoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "duracion" INTEGER NOT NULL,
    "revenuePercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cursoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectTeacher" (
    "id" SERIAL NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "SubjectTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" SERIAL NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "fechaInscripcion" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoIncripcion" NOT NULL,
    "planId" INTEGER NOT NULL,
    "modalidad" "ModalidadEstudio" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fechaPago" TIMESTAMP(3) NOT NULL,
    "estadoPago" "EstadoPago" NOT NULL,
    "tipoPago" "TipoPago" NOT NULL,
    "pagadorId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precioBase" DOUBLE PRECISION NOT NULL,
    "cantidadDiplomaturas" INTEGER NOT NULL,
    "cantidadBachilleratos" INTEGER NOT NULL,
    "precioDiplomatura" DOUBLE PRECISION NOT NULL,
    "precioBachillerato" DOUBLE PRECISION NOT NULL,
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
CREATE TABLE "_EnrollmentToPayment" (
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
CREATE INDEX "Student_planFijoId_idx" ON "Student"("planFijoId");

-- CreateIndex
CREATE INDEX "Course_id_idx" ON "Course"("id");

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
CREATE UNIQUE INDEX "_EnrollmentToPayment_AB_unique" ON "_EnrollmentToPayment"("A", "B");

-- CreateIndex
CREATE INDEX "_EnrollmentToPayment_B_index" ON "_EnrollmentToPayment"("B");

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
