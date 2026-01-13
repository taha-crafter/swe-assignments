import { PrismaClient } from "@prisma/client";
import { AssignmentController } from "./controller/AssignmentController";
import { AssignmentRepository } from "./repository/AssignmentRepository";
import { AssignmentService } from "./service/AssignmentService";
import { ClassRepository } from "../classes/repository/ClassRepository";

export class AssignmentModule {
    public readonly repository: AssignmentRepository;
    public readonly service: AssignmentService;
    public readonly controller: AssignmentController;

    constructor(prisma: PrismaClient, classRepository: ClassRepository) {
        this.repository = new AssignmentRepository(prisma);
        this.service = new AssignmentService(this.repository, classRepository);
        this.controller = new AssignmentController(this.service);
    }
}
