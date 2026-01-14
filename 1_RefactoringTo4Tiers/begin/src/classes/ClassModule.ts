import { PrismaClient } from "@prisma/client";
import { ClassController } from "./controller/ClassController";
import { ClassRepository } from "./repository/ClassRepository";
import { ClassService } from "./service/ClassService";

export class ClassModule {
    public readonly repository: ClassRepository;
    public readonly service: ClassService;
    public readonly controller: ClassController;

    constructor(prisma: PrismaClient) {
        this.repository = new ClassRepository(prisma);
        this.service = new ClassService(this.repository);
        this.controller = new ClassController(this.service);
    }
}
