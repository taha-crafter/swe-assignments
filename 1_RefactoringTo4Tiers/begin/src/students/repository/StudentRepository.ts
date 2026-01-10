import { PrismaClient } from "@prisma/client";

export class StudentRepository {
    constructor(private prisma: PrismaClient) { }

    async save(name: string) {
        const data = await this.prisma.student.create({
            data: {
                name,
            },
        });

        return data;
    }

    async findAll() {
        return await this.prisma.student.findMany({
            orderBy: { name: 'asc' },
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            }
        });
    }

    async findById(id: string) {
        return await this.prisma.student.findUnique({
            where: { id },
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            }
        });
    }

    async findSubmittedAssignments(studentId: string) {
        return await this.prisma.studentAssignment.findMany({
            where: {
                studentId,
                status: 'submitted'
            },
            include: {
                assignment: true
            },
        });
    }

    async findWithGrades(studentId: string) {
        return await this.prisma.studentAssignment.findMany({
            where: {
                studentId,
                status: 'submitted',
                grade: {
                    not: null
                }
            },
            include: {
                assignment: true
            },
        });
    }
}
