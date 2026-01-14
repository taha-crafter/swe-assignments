import { NextFunction, Request, Response } from "express";
import { CreateClassDTO, ClassID } from "../dtos/classes.dto";
import { ClassService } from "../service/ClassService";
import { parseForResponse } from "../../shared/utils";
import { Controller } from "../../shared/server";

export class ClassController extends Controller {
    constructor(private classService: ClassService) {
        super();
        this.setupRoutes();
    }

    protected setupRoutes() {
        this.router.post("/", this.createClass);
        this.router.get("/:id/assignments", this.getClassAssignments);
    }

    private createClass = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = CreateClassDTO.fromRequest(req.body);
            const data = await this.classService.createClass(dto);
            res.status(201).json({
                error: undefined,
                data: parseForResponse(data),
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    private getClassAssignments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = ClassID.fromRequestParams(req.params);
            const data = await this.classService.getAssignmentsByClassId(dto.id);
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
