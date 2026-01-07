import { PrismaClient } from "@prisma/client";

export class DatabaseFixture {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async resetDatabase() {
        await this.prisma.$transaction([
            // 1. Delete Child Tables (Dependents)
            this.prisma.studentAssignment.deleteMany(),
            this.prisma.classEnrollment.deleteMany(),
            this.prisma.reportCard.deleteMany(),
            this.prisma.classGradeReport.deleteMany(),
            this.prisma.assignment.deleteMany(),

            // 2. Delete Parent Tables (Roots)
            this.prisma.student.deleteMany(),
            this.prisma.class.deleteMany(),
        ]);
    }

    async disconnect() {
        await this.prisma.$disconnect();
    }

    // --- Seeding DSL ---

    async addStudent(name: string) {
        return await this.prisma.student.create({
            data: { name }
        });
    }

    async addClass(name: string) {
        return await this.prisma.class.create({
            data: { name }
        });
    }

    async enrollStudent(studentId: string, classId: string) {
        return await this.prisma.classEnrollment.create({
            data: { studentId, classId }
        });
    }

    async getEnrollment(studentId: string, classId: string) {
        return await this.prisma.classEnrollment.findFirst({
            where: { studentId, classId }
        });
    }

    async addAssignment(classId: string, title: string) {
        return await this.prisma.assignment.create({
            data: { classId, title }
        });
    }

    async addStudentAssignment(studentId: string, assignmentId: string, status: string = 'NOT_STARTED', grade?: string) {
        return await this.prisma.studentAssignment.create({
            data: { studentId, assignmentId, status, grade }
        });
    }

    async getStudentAssignment(studentId: string, assignmentId: string) {
        return await this.prisma.studentAssignment.findFirst({
            where: { studentId, assignmentId }
        });
    }
}
