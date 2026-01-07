import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import { app, Errors } from '@/index';
import { DatabaseFixture } from '@/tests/fixtures/database.fixture';

const feature = loadFeature('src/tests/classes/manage-classes.feature');

defineFeature(feature, (test) => {
    const db = new DatabaseFixture();
    let classId: string;
    let response: supertest.Response;

    beforeEach(async () => {
        await db.resetDatabase();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    test('Successfully create a class', ({ when, then, and }) => {
        when(/^I create a class named "(.*)"$/, async (name: string) => {
            response = await supertest(app).post('/classes').send({ name });
        });

        then('the class should be successfully created', () => {
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });

        and(/^the class should have the name "(.*)"$/, (name: string) => {
            expect(response.body.data.name).toBe(name);
        });
    });

    test('Error when creating class without a name', ({ when, then }) => {
        when('I try to create a class without a name', async () => {
            response = await supertest(app).post('/classes').send({});
        });

        then('I should receive a validation error', () => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(Errors.ValidationError);
        });
    });

    test('View assignments for a class', ({ given, and, when, then }) => {
        given(/^a class named "(.*)" exists$/, async (name: string) => {
            const cls = await db.addClass(name);
            classId = cls.id;
        });

        and(/^the class has assignments "(.*)" and "(.*)"$/, async (title1: string, title2: string) => {
            await db.addAssignment(classId, title1);
            await db.addAssignment(classId, title2);
        });

        when('I request the assignments for that class', async () => {
            response = await supertest(app).get(`/classes/${classId}/assignments`);
        });

        then(/^I should receive (\d+) assignments$/, (count: string) => {
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(parseInt(count));
        });

        and(/^the assignments should include "(.*)" and "(.*)"$/, (title1: string, title2: string) => {
            const titles = response.body.data.map((a: any) => a.title);
            expect(titles).toContain(title1);
            expect(titles).toContain(title2);
        });
    });
});
