import { PrismaClient } from "@prisma/client";
import { EnrollmentController } from "./controller/EnrollmentController";
import { EnrollmentRepository } from "./repository/EnrollmentRepository";
import { EnrollmentService } from "./service/EnrollmentService";
import { StudentRepository } from "../students/repository/StudentRepository";
import { ClassRepository } from "../classes/repository/ClassRepository";

export class EnrollmentModule {
    public readonly repository: EnrollmentRepository;
    public readonly service: EnrollmentService;
    public readonly controller: EnrollmentController;

    constructor(
        prisma: PrismaClient,
        studentRepository: StudentRepository,
        classRepository: ClassRepository
    ) {
        this.repository = new EnrollmentRepository(prisma);
        this.service = new EnrollmentService(
            this.repository,
            studentRepository,
            classRepository
        );
        this.controller = new EnrollmentController(this.service);
    }
}
