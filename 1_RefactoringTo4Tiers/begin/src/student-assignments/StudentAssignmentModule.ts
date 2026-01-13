import { PrismaClient } from "@prisma/client";
import { StudentAssignmentController } from "./controller/StudentAssignmentController";
import { StudentAssignmentRepository } from "./repository/StudentAssignmentRepository";
import { StudentAssignmentService } from "./service/StudentAssignmentService";
import { StudentRepository } from "../students/repository/StudentRepository";
import { AssignmentRepository } from "../assignments/repository/AssignmentRepository";

export class StudentAssignmentModule {
    public readonly repository: StudentAssignmentRepository;
    public readonly service: StudentAssignmentService;
    public readonly controller: StudentAssignmentController;

    constructor(
        prisma: PrismaClient,
        studentRepository: StudentRepository,
        assignmentRepository: AssignmentRepository
    ) {
        this.repository = new StudentAssignmentRepository(prisma);
        this.service = new StudentAssignmentService(
            this.repository,
            studentRepository,
            assignmentRepository
        );
        this.controller = new StudentAssignmentController(this.service);
    }
}
