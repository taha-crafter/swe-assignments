import { NextFunction, Request, Response } from "express";
import { CreateClassDTO } from "../dtos/classes.dto";
import { ClassService } from "../service/ClassService";
import { parseForResponse } from "../../shared/utils";

export class ClassController {
    constructor(private classService: ClassService) { }

    createClass = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
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
}
