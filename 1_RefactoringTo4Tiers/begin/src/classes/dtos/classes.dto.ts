import { isMissingKeys, isUUID } from "../../shared/utils";
import { InvalidRequestBodyException } from "../../shared/exceptions";

class CreateClassDTO {
    constructor(public name: string) { }

    static fromRequest(body: unknown) {
        const requiredKeys = ["name"];
        const isRequestInvalid =
            !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys);
        }

        const { name } = body as { name: string };

        return new CreateClassDTO(name);
    }
}

class ClassID {
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

        return new ClassID(id);
    }
}

export { CreateClassDTO, ClassID };
