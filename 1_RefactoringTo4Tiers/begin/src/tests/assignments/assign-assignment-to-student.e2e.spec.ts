import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import { app } from '@/index';
import { DatabaseFixture } from '@/tests/fixtures/database.fixture';
import { Errors } from '@/index';

const feature = loadFeature('src/tests/assignments/assign-assignment-to-student.feature');

defineFeature(feature, (test) => {
    const db = new DatabaseFixture();
    let studentId: string;
    let classId: string;
    let assignmentId: string;
    let response: supertest.Response;

    beforeEach(async () => {
        await db.resetDatabase();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    test('Successfully assign an assignment to a student', ({ given, when, then, and }) => {
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

        and(/^an assignment "(.*)" exists for the class$/, async (title: string) => {
            const assignment = await db.addAssignment(classId, title);
            assignmentId = assignment.id;
        });

        when('I assign the assignment to the student', async () => {
            // This is the endpoint that creates the StudentAssignment link
            response = await supertest(app).post('/student-assignments').send({ studentId, assignmentId });
        });

        then('the assignment should be successfully assigned', () => {
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });

        and('the assignment record should exist in the system for that student', async () => {
            const record = await db.getStudentAssignment(studentId, assignmentId);
            expect(record).not.toBeNull();
        });
    });

    test('Error when assignment does not exist', ({ given, when, then }) => {
        given(/^a student named "(.*)" exists$/, async (name: string) => {
            const student = await db.addStudent(name);
            studentId = student.id;
            assignmentId = '00000000-0000-4000-a000-000000000000';
        });

        when('I try to assign a non-existent assignment', async () => {
            response = await supertest(app).post('/student-assignments').send({ studentId, assignmentId });
        });

        then('I should receive an assignment not found error', () => {
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(Errors.AssignmentNotFound);
        });
    });
});
