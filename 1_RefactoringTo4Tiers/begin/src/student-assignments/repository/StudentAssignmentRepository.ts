import { PrismaClient } from "@prisma/client";

export class StudentAssignmentRepository {
    constructor(private prisma: PrismaClient) { }

    async create(studentId: string, assignmentId: string) {
        return await this.prisma.studentAssignment.create({
            data: {
                studentId,
                assignmentId,
            }
        });
    }

    async findById(id: string) {
        return await this.prisma.studentAssignment.findUnique({
            where: {
                id
            }
        });
    }

    async updateStatus(id: string, status: 'submitted' | 'assigned') {
        return await this.prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                status
            }
        });
    }

    async updateGrade(id: string, grade: string) {
        return await this.prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                grade
            }
        });
    }
}
