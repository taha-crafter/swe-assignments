import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import { app, Errors } from '@/index';
import { DatabaseFixture } from '@/tests/fixtures/database.fixture';

const feature = loadFeature('src/tests/assignments/submit-student-assignment.feature');

defineFeature(feature, (test) => {
    const db = new DatabaseFixture();
    let studentId: string;
    let classId: string;
    let assignmentId: string;
    let studentAssignmentId: string;
    let response: supertest.Response;

    beforeEach(async () => {
        await db.resetDatabase();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    test('Successfully submit an existing assignment', ({ given, and, when, then }) => {
        given(/^a student named "(.*)" exists$/, async (name: string) => {
            const student = await db.addStudent(name);
            studentId = student.id;
        });

        and(/^a class named "(.*)" exists$/, async (name: string) => {
            const cls = await db.addClass(name);
            classId = cls.id;
        });

        and('the student is enrolled in the class', async () => {
            await db.enrollStudent(studentId, classId);
        });

        and(/^an assignment "(.*)" is assigned to the student$/, async (title: string) => {
            const assignment = await db.addAssignment(classId, title);
            assignmentId = assignment.id;

            // Create the initial "Assigned" record (status NOT_STARTED)
            const sa = await db.addStudentAssignment(studentId, assignmentId);
            studentAssignmentId = sa.id;
        });

        when('I submit that assignment', async () => {
            response = await supertest(app)
                .post('/student-assignments/submit')
                .send({ id: studentAssignmentId });
        });

        then('the submission should be successful', () => {
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        and(/^the assignment status should be "(.*)" in the system$/, async (expectedStatus: string) => {
            const record = await db.getStudentAssignment(studentId, assignmentId);
            expect(record?.status).toBe(expectedStatus);
        });
    });

    test('Error when submitting a non-existent assignment record', ({ when, then }) => {
        when('I try to submit an assignment with a non-existent ID', async () => {
            const fakeId = '00000000-0000-4000-a000-000000000000';
            response = await supertest(app)
                .post('/student-assignments/submit')
                .send({ id: fakeId });
        });

        then('I should receive an assignment not found error', () => {
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(Errors.AssignmentNotFound);
        });
    });
});
