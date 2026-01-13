import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import { app } from '@/app';
import { DatabaseFixture } from '@/tests/fixtures/database.fixture';
import { Errors } from '@/shared/constants';

const feature = loadFeature('src/tests/students/get-student-by-id/get-student-by-id.feature');

interface StudentDetail {
    classes: unknown[];
    assignments: unknown[];
    reportCards: unknown[];
}

defineFeature(feature, (test) => {
    const db = new DatabaseFixture();
    let studentId: string;
    let response: supertest.Response;

    beforeEach(async () => {
        await db.resetDatabase();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    test('Retrieve an existing student successfully', ({ given, when, then, and }) => {
        given(/^a student named "(.*)" exists in the system$/, async (name: string) => {
            const student = await db.addStudent(name);
            studentId = student.id;
        });

        when('I request the student by their ID', async () => {
            response = await supertest(app).get(`/students/${studentId}`);
        });

        then(/^I should receive a successful response for "(.*)"$/, (name: string) => {
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(name);
            expect(response.body.data.id).toBe(studentId);
        });

        and('the response should include the full profile information', () => {
            const student = response.body.data as StudentDetail;
            expect(Array.isArray(student.classes)).toBe(true);
            expect(Array.isArray(student.assignments)).toBe(true);
            expect(Array.isArray(student.reportCards)).toBe(true);
        });
    });

    test('Error when student does not exist', ({ given, when, then }) => {
        let requestedId: string;

        given(/^no student exists with the ID "(.*)"$/, async (id: string) => {
            requestedId = id;
        });

        when('I request a student with that ID', async () => {
            response = await supertest(app).get(`/students/${requestedId}`);
        });

        then('I should receive a not found error', () => {
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(Errors.StudentNotFound);
        });
    });

    test('Error when ID format is invalid', ({ when, then }) => {
        when(/^I request a student with an invalid ID "(.*)"$/, async (id: string) => {
            response = await supertest(app).get(`/students/${id}`);
        });

        then('I should receive an invalid input error', () => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(Errors.ValidationError);
        });
    });
});
