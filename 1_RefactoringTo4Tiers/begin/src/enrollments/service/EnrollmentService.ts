import { CreateEnrollmentDTO } from "../dtos/enrollments.dto";
import { EnrollmentRepository } from "../repository/EnrollmentRepository";
import { StudentRepository } from "../../students/repository/StudentRepository";
import { ClassRepository } from "../../classes/repository/ClassRepository";
import {
    ClassNotFoundException,
    StudentAlreadyEnrolledException,
    StudentNotFoundException
} from "../../shared/exceptions";

export class EnrollmentService {
    constructor(
        private enrollmentRepository: EnrollmentRepository,
        private studentRepository: StudentRepository,
        private classRepository: ClassRepository
    ) { }

    async enrollStudent(dto: CreateEnrollmentDTO) {
        const student = await this.studentRepository.findById(dto.studentId);
        if (!student) {
            throw new StudentNotFoundException();
        }

        const cls = await this.classRepository.findById(dto.classId);
        if (!cls) {
            throw new ClassNotFoundException(dto.classId);
        }

        const existing = await this.enrollmentRepository.findByStudentAndClass(
            dto.studentId,
            dto.classId
        );
        if (existing) {
            throw new StudentAlreadyEnrolledException();
        }

        return await this.enrollmentRepository.save(dto.studentId, dto.classId);
    }
}
