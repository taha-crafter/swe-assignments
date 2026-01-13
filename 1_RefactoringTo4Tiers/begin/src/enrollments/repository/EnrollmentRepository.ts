import { PrismaClient } from "@prisma/client";

export class EnrollmentRepository {
    constructor(private prisma: PrismaClient) { }

    async save(studentId: string, classId: string) {
        return await this.prisma.classEnrollment.create({
            data: {
                studentId,
                classId
            }
        });
    }

    async findByStudentAndClass(studentId: string, classId: string) {
        return await this.prisma.classEnrollment.findFirst({
            where: {
                studentId,
                classId
            }
        });
    }
}
