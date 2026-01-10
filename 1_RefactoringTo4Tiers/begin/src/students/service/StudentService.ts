import { CreateStudentDTO } from "../dtos/students.dto";
import { StudentRepository } from "../repository/StudentRepository";
import { StudentNotFoundException } from "../../shared/exceptions";

export class StudentService {
    constructor(private studentRepository: StudentRepository) { }

    async createStudent(dto: CreateStudentDTO) {
        const name = dto.name;

        const response = await this.studentRepository.save(name);

        return response;
    }

    async getAllStudents() {
        return await this.studentRepository.findAll();
    }

    async getStudentById(id: string) {
        const student = await this.studentRepository.findById(id);
        if (!student) {
            throw new StudentNotFoundException();
        }
        return student;
    }
    async getStudentAssignments(id: string) {
        await this.getStudentById(id);
        return await this.studentRepository.findSubmittedAssignments(id);
    }

    async getStudentGrades(id: string) {
        await this.getStudentById(id);
        return await this.studentRepository.findWithGrades(id);
    }
}
