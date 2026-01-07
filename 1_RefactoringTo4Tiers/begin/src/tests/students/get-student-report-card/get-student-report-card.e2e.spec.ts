import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import { app, Errors } from '@/index';
import { DatabaseFixture } from '@/tests/fixtures/database.fixture';

const feature = loadFeature('src/tests/students/get-student-report-card/get-student-report-card.feature');

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

    const seedAssignments = async (table: any[]) => {
        const cls = await db.addClass("General Class");
        for (const row of table) {
            const assignment = await db.addAssignment(cls.id, row.Title);
            const grade = row.Grade === 'null' ? undefined : row.Grade;
            await db.addStudentAssignment(studentId, assignment.id, row.Status, grade);
        }
    };

    test('Successfully retrieve submitted assignments', ({ given, and, when, then }) => {
        given(/^a student named "(.*)" exists$/, async (name: string) => {
            const student = await db.addStudent(name);
            studentId = student.id;
        });

        and('the student has the following assignments:', async (table: any[]) => {
            await seedAssignments(table);
        });

        when('I request all submitted assignments for the student', async () => {
            response = await supertest(app).get(`/student/${studentId}/assignments`);
        });

        then(/^the response should contain (\d+) assignments$/, (count: string) => {
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(parseInt(count));
        });

        and(/^the assignments should be "(.*)" and "(.*)"$/, (title1: string, title2: string) => {
            const titles = response.body.data.map((sa: any) => sa.assignment.title);
            expect(titles).toContain(title1);
            expect(titles).toContain(title2);
        });

        and(/^"(.*)" should NOT be in the list$/, (title: string) => {
            const titles = response.body.data.map((sa: any) => sa.assignment.title);
            expect(titles).not.toContain(title);
        });
    });

    test('Successfully retrieve graded assignments (Report Card)', ({ given, and, when, then }) => {
        given(/^a student named "(.*)" exists$/, async (name: string) => {
            const student = await db.addStudent(name);
            studentId = student.id;
        });

        and('the student has the following assignments:', async (table: any[]) => {
            await seedAssignments(table);
        });

        when('I request the report card for the student', async () => {
            response = await supertest(app).get(`/student/${studentId}/grades`);
        });

        then(/^the response should contain (\d+) graded assignments$/, (count: string) => {
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(parseInt(count));
        });

        and(/^the grades should be "(.*)" and "(.*)"$/, (grade1: string, grade2: string) => {
            const grades = response.body.data.map((sa: any) => sa.grade);
            expect(grades).toContain(grade1);
            expect(grades).toContain(grade2);
        });

        and(/^the "(.*)" should NOT be in the report card$/, (title: string) => {
            const titles = response.body.data.map((sa: any) => sa.assignment.title);
            expect(titles).not.toContain(title);
        });
    });

    test('Error when student does not exist', ({ when, then }) => {
        when('I request the report card for a non-existent student ID', async () => {
            const fakeId = '00000000-0000-4000-a000-000000000000';
            response = await supertest(app).get(`/student/${fakeId}/grades`);
        });

        then('I should receive a student not found error', () => {
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(Errors.StudentNotFound);
        });
    });
});
