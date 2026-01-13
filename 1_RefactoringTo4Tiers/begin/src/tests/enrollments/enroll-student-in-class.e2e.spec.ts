import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import { app } from '@/app';
import { DatabaseFixture } from '@/tests/fixtures/database.fixture';
import { Errors } from '@/shared/constants';

const feature = loadFeature('src/tests/enrollments/enroll-student-in-class.feature');

defineFeature(feature, (test) => {
    const db = new DatabaseFixture();
    let studentId: string;
    let classId: string;
    let response: supertest.Response;

    beforeEach(async () => {
        await db.resetDatabase();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    test('Successfully enroll a student in a class', ({ given, when, then, and }) => {
        given(/^a student named "(.*)" exists$/, async (name: string) => {
            const student = await db.addStudent(name);
            studentId = student.id;
        });

        and(/^a class named "(.*)" exists$/, async (name: string) => {
            const cls = await db.addClass(name);
            classId = cls.id;
        });

        when('I enroll the student in the class', async () => {
            response = await supertest(app).post('/class-enrollments').send({ studentId, classId });
        });

        then('the student should be successfully enrolled', () => {
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });

        and('the enrollment should be recorded in the system', async () => {
            const enrollment = await db.getEnrollment(studentId, classId);
            expect(enrollment).not.toBeNull();
        });
    });

    test('Error when student is already enrolled', ({ given, when, then }) => {
        given(/^a student named "(.*)" is already enrolled in "(.*)"$/, async (studentName: string, className: string) => {
            const student = await db.addStudent(studentName);
            const cls = await db.addClass(className);
            studentId = student.id;
            classId = cls.id;
            await db.enrollStudent(studentId, classId);
        });

        when('I try to enroll the student in the class again', async () => {
            response = await supertest(app).post('/class-enrollments').send({ studentId, classId });
        });

        then(/^I should receive an "(.*)" error$/, (errorType: string) => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(Errors.StudentAlreadyEnrolled);
        });
    });

    test('Error when student does not exist', ({ given, when, then }) => {
        given(/^a class named "(.*)" exists$/, async (name: string) => {
            const cls = await db.addClass(name);
            classId = cls.id;
            studentId = '00000000-0000-4000-a000-000000000000';
        });

        when('I try to enroll a non-existent student in the class', async () => {
            response = await supertest(app).post('/class-enrollments').send({ studentId, classId });
        });

        then('I should receive a student not found error', () => {
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(Errors.StudentNotFound);
        });
    });

    test('Error when class does not exist', ({ given, when, then }) => {
        given(/^a student named "(.*)" exists$/, async (name: string) => {
            const student = await db.addStudent(name);
            studentId = student.id;
            classId = '00000000-0000-4000-a000-000000000000';
        });

        when('I try to enroll the student in a non-existent class', async () => {
            response = await supertest(app).post('/class-enrollments').send({ studentId, classId });
        });

        then('I should receive a class not found error', () => {
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(Errors.ClassNotFound);
        });
    });
});
