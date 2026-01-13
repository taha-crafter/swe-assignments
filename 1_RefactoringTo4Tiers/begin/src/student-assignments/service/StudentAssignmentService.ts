import { AssignStudentDTO, GradeAssignmentDTO, SubmitAssignmentDTO } from "../dtos/student-assignments.dto";
import { StudentAssignmentRepository } from "../repository/StudentAssignmentRepository";
import { StudentRepository } from "../../students/repository/StudentRepository";
import { AssignmentRepository } from "../../assignments/repository/AssignmentRepository";
import {
    AssignmentNotFoundException,
    StudentAssignmentNotFoundException,
    StudentNotFoundException
} from "../../shared/exceptions";

export class StudentAssignmentService {
    constructor(
        private studentAssignmentRepository: StudentAssignmentRepository,
        private studentRepository: StudentRepository,
        private assignmentRepository: AssignmentRepository
    ) { }

    async assignStudent(dto: AssignStudentDTO) {
        const student = await this.studentRepository.findById(dto.studentId);
        if (!student) {
            throw new StudentNotFoundException();
        }

        const assignment = await this.assignmentRepository.findById(dto.assignmentId);
        if (!assignment) {
            throw new AssignmentNotFoundException();
        }

        return await this.studentAssignmentRepository.create(dto.studentId, dto.assignmentId);
    }

    async submitAssignment(dto: SubmitAssignmentDTO) {
        const studentAssignment = await this.studentAssignmentRepository.findById(dto.id);
        if (!studentAssignment) {
            throw new StudentAssignmentNotFoundException();
        }

        return await this.studentAssignmentRepository.updateStatus(dto.id, 'submitted');
    }

    async gradeAssignment(dto: GradeAssignmentDTO) {
        const studentAssignment = await this.studentAssignmentRepository.findById(dto.id);
        if (!studentAssignment) {
            throw new StudentAssignmentNotFoundException();
        }

        return await this.studentAssignmentRepository.updateGrade(dto.id, dto.grade);
    }
}
