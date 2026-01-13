import { NextFunction, Request, Response } from "express";
import { CreateStudentDTO, StudentID } from "../dtos/students.dto";
import { StudentService } from "../service/StudentService";
import { parseForResponse } from "../../shared/utils";
import { Controller } from "../../shared/server";

export class StudentController extends Controller {
    constructor(private studentService: StudentService) {
        super();
        this.setupRoutes();
    }

    protected setupRoutes() {
        this.router.post("/", this.createStudent);
        this.router.get("/", this.getAllStudents);
        this.router.get("/:id", this.getStudent);
        this.router.get("/:id/assignments", this.getStudentAssignments);
        this.router.get("/:id/grades", this.getStudentGrades);
    }

    private createStudent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = CreateStudentDTO.fromRequest(req.body);
            const data = await this.studentService.createStudent(dto);
            res.status(201).json({
                error: undefined,
                data: parseForResponse(data),
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    private getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.studentService.getAllStudents();
            res.status(200).json({ error: undefined, data: parseForResponse(data), success: true });
        } catch (error) {
            next(error);
        }
    };

    private getStudent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = StudentID.fromRequestParams(req.params);
            const data = await this.studentService.getStudentById(dto.id);
            res.status(200).json({
                error: undefined,
                data: parseForResponse(data),
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    private getStudentAssignments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = StudentID.fromRequestParams(req.params);
            const data = await this.studentService.getStudentAssignments(dto.id);
            res.status(200).json({
                error: undefined,
                data: parseForResponse(data),
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    private getStudentGrades = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = StudentID.fromRequestParams(req.params);
            const data = await this.studentService.getStudentGrades(dto.id);
            res.status(200).json({
                error: undefined,
                data: parseForResponse(data),
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };
}
