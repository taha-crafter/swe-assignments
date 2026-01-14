import { CreateAssignmentDTO } from "../dtos/assignments.dto";
import { AssignmentRepository } from "../repository/AssignmentRepository";
import { ClassRepository } from "../../classes/repository/ClassRepository";
import { AssignmentNotFoundException, ClassNotFoundException } from "../../shared/exceptions";

export class AssignmentService {
    constructor(
        private assignmentRepository: AssignmentRepository,
        private classRepository: ClassRepository
    ) { }

    async createAssignment(dto: CreateAssignmentDTO) {
        return await this.assignmentRepository.save(dto.classId, dto.title);
    }

    async getAssignmentById(id: string) {
        const assignment = await this.assignmentRepository.findById(id);
        if (!assignment) {
            throw new AssignmentNotFoundException();
        }
        return assignment;
    }

    async getAssignmentsByClassId(classId: string) {
        const cls = await this.classRepository.findById(classId);
        if (!cls) {
            throw new ClassNotFoundException(classId);
        }

        return await this.assignmentRepository.findByClassId(classId);
    }
}
