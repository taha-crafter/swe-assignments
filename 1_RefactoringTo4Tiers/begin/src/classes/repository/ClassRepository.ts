import { PrismaClient } from "@prisma/client";

export class ClassRepository {
    constructor(private prisma: PrismaClient) { }

    async save(name: string) {
        return await this.prisma.class.create({
            data: {
                name
            }
        });
    }

    async findById(id: string) {
        return await this.prisma.class.findUnique({
            where: {
                id
            }
        });
    }

    async findAssignments(classId: string) {
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
