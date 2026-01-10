import { prisma } from "../database";
import { ClassController } from "./controller/ClassController";
import { ClassRepository } from "./repository/ClassRepository";
import { ClassService } from "./service/ClassService";

const classRepository = new ClassRepository(prisma);
const classService = new ClassService(classRepository);
const classController = new ClassController(classService);

export { classController };
