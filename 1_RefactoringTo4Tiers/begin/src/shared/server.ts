import express, { Application, Router } from "express";
import cors from "cors";
import { Server as HttpServer } from "http";
import { errorHandler } from "./errors";

export abstract class Controller {
    protected readonly router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        return this.router;
    }

    protected abstract setupRoutes(): void;
}

export class Server {
    private readonly app: Application;

    constructor(
        private studentsController: Controller,
        private classesController: Controller,
        private assignmentsController: Controller,
        private enrollmentsController: Controller,
        private studentAssignmentsController: Controller
    ) {
        this.app = express();
        this.configureMiddlewares();
        this.registerRoutes();
        this.registerErrorHandlers();
    }

    private configureMiddlewares() {
        this.app.use(express.json());
        this.app.use(cors());
    }

    private registerRoutes() {
        this.app.use("/students", this.studentsController.getRouter());
        this.app.use("/student", this.studentsController.getRouter());
        this.app.use("/classes", this.classesController.getRouter());
        this.app.use("/assignments", this.assignmentsController.getRouter());
        this.app.use("/class-enrollments", this.enrollmentsController.getRouter());
        this.app.use("/student-assignments", this.studentAssignmentsController.getRouter());
    }

    private registerErrorHandlers() {
        this.app.use(errorHandler);
    }

    public start(port: number): HttpServer {
        const server = this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        this.setupGracefulShutdown(server);
        return server;
    }

    private setupGracefulShutdown(httpServer: HttpServer) {
        const shutdown = (signal: string) => {
            console.log(`Received ${signal}. Shutting down gracefully...`);
            httpServer.close(() => {
                console.log("Http server closed.");
                process.exit(0);
            });

            setTimeout(() => {
                console.error("Could not close connections in time, forcefully shutting down");
                process.exit(1);
            }, 10000);
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));
    }

    public getApp() {
        return this.app;
    }
}
