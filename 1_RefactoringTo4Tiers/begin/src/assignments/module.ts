import { prisma } from "../database";
import { AssignmentController } from "./controller/AssignmentController";
import { AssignmentRepository } from "./repository/AssignmentRepository";
import { AssignmentService } from "./service/AssignmentService";
import { ClassRepository } from "../classes/repository/ClassRepository";

const assignmentRepository = new AssignmentRepository(prisma);
const classRepository = new ClassRepository(prisma);
const assignmentService = new AssignmentService(assignmentRepository, classRepository);
const assignmentController = new AssignmentController(assignmentService);

export { assignmentController };
