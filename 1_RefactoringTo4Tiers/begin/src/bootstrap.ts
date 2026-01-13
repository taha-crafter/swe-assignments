import { PrismaClient } from "@prisma/client";
import { Server } from "./shared/server";

import { StudentModule } from "./students/StudentModule";
import { ClassModule } from "./classes/ClassModule";
import { AssignmentModule } from "./assignments/AssignmentModule";
import { EnrollmentModule } from "./enrollments/EnrollmentModule";
import { StudentAssignmentModule } from "./student-assignments/StudentAssignmentModule";

export function bootstrap() {
    const prisma = new PrismaClient();

    const students = new StudentModule(prisma);
    const classes = new ClassModule(prisma);
    const assignments = new AssignmentModule(prisma, classes.repository);
    const enrollments = new EnrollmentModule(prisma, students.repository, classes.repository);
    const studentAssignments = new StudentAssignmentModule(prisma, students.repository, assignments.repository);

    const server = new Server(
        students.controller,
        classes.controller,
        assignments.controller,
        enrollments.controller,
        studentAssignments.controller
    );

    const app = server.getApp();

    return { server, app, prisma };
}
