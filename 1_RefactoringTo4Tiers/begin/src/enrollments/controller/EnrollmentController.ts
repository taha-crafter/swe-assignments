import { NextFunction, Request, Response } from "express";
import { CreateEnrollmentDTO } from "../dtos/enrollments.dto";
import { EnrollmentService } from "../service/EnrollmentService";
import { parseForResponse } from "../../shared/utils";
import { Controller } from "../../shared/server";

export class EnrollmentController extends Controller {
    constructor(private enrollmentService: EnrollmentService) {
        super();
        this.setupRoutes();
    }

    protected setupRoutes() {
        this.router.post("/", this.enrollStudent);
    }

    private enrollStudent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = CreateEnrollmentDTO.fromRequest(req.body);
            const data = await this.enrollmentService.enrollStudent(dto);
            res.status(201).json({
                error: undefined,
                data: parseForResponse(data),
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };
}
