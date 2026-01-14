import { NextFunction, Request, Response } from "express";
import { CreateAssignmentDTO, AssignmentID } from "../dtos/assignments.dto";
import { AssignmentService } from "../service/AssignmentService";
import { parseForResponse } from "../../shared/utils";
import { Controller } from "../../shared/server";

export class AssignmentController extends Controller {
    constructor(private assignmentService: AssignmentService) {
        super();
        this.setupRoutes();
    }

    protected setupRoutes() {
        this.router.post("/", this.createAssignment);
        this.router.get("/:id", this.getAssignment);
    }

    private createAssignment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = CreateAssignmentDTO.fromRequest(req.body);
            const data = await this.assignmentService.createAssignment(dto);
            res.status(201).json({
                error: undefined,
                data: parseForResponse(data),
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    private getAssignment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = AssignmentID.fromRequestParams(req.params);
            const data = await this.assignmentService.getAssignmentById(dto.id);
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
