
class InvalidRequestBodyException extends Error {
    constructor(missingKeys: string[]) {
        super("Body is missing required key: " + missingKeys.join(", "));
        Object.setPrototypeOf(this, InvalidRequestBodyException.prototype);
    }
}

class StudentNotFoundException extends Error {
    constructor() {
        super("Student not found");
        Object.setPrototypeOf(this, StudentNotFoundException.prototype);
    }
}

class ClassNotFoundException extends Error {
    constructor(id: string) {
        super(`Class with id ${id} not found`);
        Object.setPrototypeOf(this, ClassNotFoundException.prototype);
    }
}

class StudentAlreadyEnrolledException extends Error {
    constructor() {
        super("Student is already enrolled in class");
        Object.setPrototypeOf(this, StudentAlreadyEnrolledException.prototype);
    }
}

class AssignmentNotFoundException extends Error {
    constructor() {
        super("Assignment not found");
        Object.setPrototypeOf(this, AssignmentNotFoundException.prototype);
    }
}

class StudentAssignmentNotFoundException extends Error {
    constructor() {
        super(
            "Student assignment not found. Please, make sure the student is assigned to the assignment."
        );
        Object.setPrototypeOf(this, StudentAssignmentNotFoundException.prototype);
    }
}

export {
    InvalidRequestBodyException,
    StudentNotFoundException,
    ClassNotFoundException,
    StudentAlreadyEnrolledException,
    AssignmentNotFoundException,
    StudentAssignmentNotFoundException,
};
