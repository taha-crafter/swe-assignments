import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import { app } from '@/app';
import { Errors } from '@/shared/constants';
import { DatabaseFixture } from '@/tests/fixtures/database.fixture';

const feature = loadFeature('src/tests/assignments/grade-student-assignment.feature');

defineFeature(feature, (test) => {
    const db = new DatabaseFixture();
    let studentId: string;
    let assignmentId: string;
    let studentAssignmentId: string;
    let response: supertest.Response;

    beforeEach(async () => {
        await db.resetDatabase();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    test('Successfully grade a submitted assignment', ({ given, and, when, then }) => {
        given(/^a student named "(.*)" exists$/, async (name: string) => {
            const student = await db.addStudent(name);
            studentId = student.id;
        });

        and(/^an assignment "(.*)" is assigned and submitted by the student$/, async (title: string) => {
            const cls = await db.addClass("General Science");
            const assignment = await db.addAssignment(cls.id, title);
            assignmentId = assignment.id;

            const sa = await db.addStudentAssignment(studentId, assignmentId, 'submitted');
            studentAssignmentId = sa.id;
        });

        when(/^I grade the assignment with "(.*)"$/, async (grade: string) => {
            response = await supertest(app)
                .post('/student-assignments/grade')
                .send({ id: studentAssignmentId, grade });
        });

        then('the grading should be successful', () => {
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        and(/^the assignment should have the grade "(.*)" in the system$/, async (expectedGrade: string) => {
            const record = await db.getStudentAssignment(studentId, assignmentId);
            expect(record?.grade).toBe(expectedGrade);
        });

        and(/^the status should be "(.*)"$/, async (expectedStatus: string) => {
            const record = await db.getStudentAssignment(studentId, assignmentId);
            expect(record?.status).toBe(expectedStatus);
        });
    });

    test('Error when grading with missing information', ({ given, and, when, then }) => {
        given(/^a student named "(.*)" exists$/, async (name: string) => {
            const student = await db.addStudent(name);
            studentId = student.id;
        });

        and(/^an assignment "(.*)" is assigned and submitted by the student$/, async (title: string) => {
            const cls = await db.addClass("General Science");
            const assignment = await db.addAssignment(cls.id, title);
            assignmentId = assignment.id;
            const sa = await db.addStudentAssignment(studentId, assignmentId, 'submitted');
            studentAssignmentId = sa.id;
        });

        when('I try to grade the assignment without providing a grade', async () => {
            response = await supertest(app)
                .post('/student-assignments/grade')
                .send({ id: studentAssignmentId });
        });

        then('I should receive a validation error', () => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(Errors.ValidationError);
        });
    });
});
