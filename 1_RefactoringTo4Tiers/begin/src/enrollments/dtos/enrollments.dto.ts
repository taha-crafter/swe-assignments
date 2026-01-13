import { isMissingKeys } from "../../shared/utils";
import { InvalidRequestBodyException } from "../../shared/exceptions";

export class CreateEnrollmentDTO {
    constructor(public studentId: string, public classId: string) { }

    static fromRequest(body: unknown) {
        const requiredKeys = ["studentId", "classId"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys);
        }

        const { studentId, classId } = body as { studentId: string; classId: string };

        return new CreateEnrollmentDTO(studentId, classId);
    }
}
