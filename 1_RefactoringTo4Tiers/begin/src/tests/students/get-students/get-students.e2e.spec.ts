import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import { app } from '@/app';
import { DatabaseFixture } from '@/tests/fixtures/database.fixture';

const feature = loadFeature('src/tests/students/get-students/get-students.feature');

defineFeature(feature, (test) => {
    const db = new DatabaseFixture();

    beforeEach(async () => {
        await db.resetDatabase();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    test('Retrieve all students successfully in alphabetical order', ({ given, when, then, and }) => {
        let response: supertest.Response;

        given('the following students exist in the system:', async (table) => {
            for (const row of table) {
                await db.addStudent(row.name);
            }
        });

        when('I request a list of all students', async () => {
            response = await supertest(app).get('/students');
        });

        then(/^I should receive a successful response containing (.*) students$/, (count: string) => {
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(parseInt(count));
        });

        and(/^the students should be returned in alphabetical order: "(.*)", "(.*)"$/, (name1: string, name2: string) => {
            expect(response.body.data[0].name).toBe(name1);
            expect(response.body.data[1].name).toBe(name2);
        });

        and('each student should include their full profile information', () => {
            response.body.data.forEach((student: any) => {
                expect(student).toHaveProperty('classes');
                expect(student).toHaveProperty('assignments');
                expect(student).toHaveProperty('reportCards');
            });
        });
    });
});
