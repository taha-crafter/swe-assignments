import { NextFunction, Request, Response } from "express";
import { CreateAssignmentDTO, AssignmentID } from "../dtos/assignments.dto";
import { AssignmentService } from "../service/AssignmentService";
import { parseForResponse } from "../../shared/utils";

export class AssignmentController {
    constructor(private assignmentService: AssignmentService) { }

    createAssignment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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

    getAssignment = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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

    getAssignmentsByClass = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const dto = AssignmentID.fromRequestParams(req.params);
            const data = await this.assignmentService.getAssignmentsByClassId(dto.id);
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
