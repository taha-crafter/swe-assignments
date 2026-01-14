import { PrismaClient } from "@prisma/client";

export class AssignmentRepository {
    constructor(private prisma: PrismaClient) { }

    async save(classId: string, title: string) {
        return await this.prisma.assignment.create({
            data: {
                classId,
                title
            }
        });
    }

    async findById(id: string) {
        return await this.prisma.assignment.findUnique({
            where: {
                id
            },
            include: {
                class: true,
                studentTasks: true
            }
        });
    }

    async findByClassId(classId: string) {
        return await this.prisma.assignment.findMany({
            where: {
                classId
            },
            include: {
                class: true,
                studentTasks: true
            }
        });
    }
}
