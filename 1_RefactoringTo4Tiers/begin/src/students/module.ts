import { prisma } from "../database";
import { StudentController } from "./controller/StudentController";
import { StudentRepository } from "./repository/StudentRepository";
import { StudentService } from "./service/StudentService";

const studentRepository = new StudentRepository(prisma);
const studentService = new StudentService(studentRepository);
const studentController = new StudentController(studentService);

export { studentController };
