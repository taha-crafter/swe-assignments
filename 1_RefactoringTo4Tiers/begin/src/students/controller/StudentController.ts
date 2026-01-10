import { NextFunction, Request, Response } from "express";
import { CreateStudentDTO, StudentID } from "../dtos/students.dto";
import { StudentService } from "../service/StudentService";
import { parseForResponse } from "../../shared/utils";

export class StudentController {
    constructor(private studentService: StudentService) { }

    createStudent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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

    getAllStudents = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await this.studentService.getAllStudents();
            res.status(200).json({ error: undefined, data: parseForResponse(data), success: true });
        } catch (error) {
            next(error);
        }
    };

    getStudent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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
    getStudentAssignments = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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

    getStudentGrades = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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
