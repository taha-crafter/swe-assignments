import { CreateClassDTO } from "../dtos/classes.dto";
import { ClassRepository } from "../repository/ClassRepository";
import { ClassNotFoundException } from "../../shared/exceptions";

export class ClassService {
    constructor(private classRepository: ClassRepository) { }

    async createClass(dto: CreateClassDTO) {
        return await this.classRepository.save(dto.name);
    }

    async getClassById(id: string) {
        const cls = await this.classRepository.findById(id);
        if (!cls) {
            throw new ClassNotFoundException(id);
        }
        return cls;
    }
}
