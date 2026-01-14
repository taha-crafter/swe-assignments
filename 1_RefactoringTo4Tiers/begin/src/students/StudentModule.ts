import { PrismaClient } from "@prisma/client";
import { StudentController } from "./controller/StudentController";
import { StudentRepository } from "./repository/StudentRepository";
import { StudentService } from "./service/StudentService";

export class StudentModule {
    public readonly repository: StudentRepository;
    public readonly service: StudentService;
    public readonly controller: StudentController;

    constructor(prisma: PrismaClient) {
        this.repository = new StudentRepository(prisma);
        this.service = new StudentService(this.repository);
        this.controller = new StudentController(this.service);
    }
}
