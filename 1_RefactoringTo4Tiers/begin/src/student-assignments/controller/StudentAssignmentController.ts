import { NextFunction, Request, Response } from "express";
import { AssignStudentDTO, GradeAssignmentDTO, SubmitAssignmentDTO } from "../dtos/student-assignments.dto";
import { StudentAssignmentService } from "../service/StudentAssignmentService";
import { parseForResponse } from "../../shared/utils";
import { Controller } from "../../shared/server";

export class StudentAssignmentController extends Controller {
    constructor(private studentAssignmentService: StudentAssignmentService) {
        super();
        this.setupRoutes();
    }

    protected setupRoutes() {
        this.router.post("/", this.assignStudent);
        this.router.post("/submit", this.submitAssignment);
        this.router.post("/grade", this.gradeAssignment);
    }

    private assignStudent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = AssignStudentDTO.fromRequest(req.body);
            const data = await this.studentAssignmentService.assignStudent(dto);
            res.status(201).json({
                error: undefined,
                data: parseForResponse(data),
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    private submitAssignment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = SubmitAssignmentDTO.fromRequest(req.body);
            const data = await this.studentAssignmentService.submitAssignment(dto);
            res.status(200).json({
                error: undefined,
                data: parseForResponse(data),
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    private gradeAssignment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = GradeAssignmentDTO.fromRequest(req.body);
            const data = await this.studentAssignmentService.gradeAssignment(dto);
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
