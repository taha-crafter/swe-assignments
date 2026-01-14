import { isMissingKeys } from "../../shared/utils";
import { InvalidRequestBodyException } from "../../shared/exceptions";

export class AssignStudentDTO {
    constructor(public studentId: string, public assignmentId: string) { }

    static fromRequest(body: unknown) {
        const requiredKeys = ["studentId", "assignmentId"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys);
        }

        const { studentId, assignmentId } = body as { studentId: string; assignmentId: string };

        return new AssignStudentDTO(studentId, assignmentId);
    }
}

export class SubmitAssignmentDTO {
    constructor(public id: string) { }

    static fromRequest(body: unknown) {
        const requiredKeys = ["id"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys);
        }

        const { id } = body as { id: string };

        return new SubmitAssignmentDTO(id);
    }
}

export class GradeAssignmentDTO {
    constructor(public id: string, public grade: string) { }

    static fromRequest(body: unknown) {
        const requiredKeys = ["id", "grade"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys);
        }

        const { id, grade } = body as { id: string; grade: string };

        if (!['A', 'B', 'C', 'D'].includes(grade)) {
            throw new InvalidRequestBodyException(["grade"]);
        }

        return new GradeAssignmentDTO(id, grade);
    }
}
