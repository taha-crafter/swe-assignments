import { isMissingKeys, isUUID } from "../../shared/utils";
import { InvalidRequestBodyException } from "../../shared/exceptions";

class CreateAssignmentDTO {
    constructor(public classId: string, public title: string) { }

    static fromRequest(body: unknown) {
        const requiredKeys = ["classId", "title"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys);
        }

        const { classId, title } = body as { classId: string; title: string };

        return new CreateAssignmentDTO(classId, title);
    }
}

class AssignmentID {
    constructor(public id: string) { }

    static fromRequestParams(params: unknown) {
        const areParamsInvalid =
            !params || typeof params !== "object" || "id" in params === false;

        if (areParamsInvalid) {
            throw new InvalidRequestBodyException(["id"]);
        }

        const { id } = params as { id: string };

        if (!isUUID(id)) {
            throw new InvalidRequestBodyException(["id"]);
        }

        return new AssignmentID(id);
    }
}

export { CreateAssignmentDTO, AssignmentID };
