import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import { app } from '@/app';
import { Errors } from '@/shared/constants';
import { DatabaseFixture } from '@/tests/fixtures/database.fixture';

const feature = loadFeature('src/tests/classes/manage-assignments.feature');

defineFeature(feature, (test) => {
    const db = new DatabaseFixture();
    let classId: string;
    let assignmentId: string;
    let response: supertest.Response;

    beforeEach(async () => {
        await db.resetDatabase();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    test('Successfully create an assignment', ({ given, when, then, and }) => {
        given(/^a class named "(.*)" exists$/, async (name: string) => {
            const cls = await db.addClass(name);
            classId = cls.id;
        });

        when(/^I create an assignment "(.*)" for that class$/, async (title: string) => {
            response = await supertest(app).post('/assignments').send({ classId, title });
        });

        then('the assignment should be successfully created', () => {
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });

        and(/^the assignment should have the title "(.*)"$/, (title: string) => {
            expect(response.body.data.title).toBe(title);
        });
    });

    test('Error when creating assignment without required fields', ({ when, then }) => {
        when('I try to create an assignment without a class ID', async () => {
            response = await supertest(app).post('/assignments').send({ title: 'Some Assignment' });
        });

        then('I should receive a validation error', () => {
            expect(response.status).toBe(400);
            expect(response.body.error).toBe(Errors.ValidationError);
        });
    });

    test('View a specific assignment by ID', ({ given, and, when, then }) => {
        given(/^a class named "(.*)" exists$/, async (name: string) => {
            const cls = await db.addClass(name);
            classId = cls.id;
        });

        and(/^an assignment "(.*)" exists for that class$/, async (title: string) => {
            const assignment = await db.addAssignment(classId, title);
            assignmentId = assignment.id;
        });

        when('I request the assignment by its ID', async () => {
            response = await supertest(app).get(`/assignments/${assignmentId}`);
        });

        then('I should receive the assignment details', () => {
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        and(/^the title should be "(.*)"$/, (title: string) => {
            expect(response.body.data.title).toBe(title);
        });
    });

    test('Error when assignment does not exist', ({ when, then }) => {
        when('I request an assignment with a non-existent ID', async () => {
            const fakeId = '00000000-0000-4000-a000-000000000000';
            response = await supertest(app).get(`/assignments/${fakeId}`);
        });

        then('I should receive an assignment not found error', () => {
            expect(response.status).toBe(404);
            expect(response.body.error).toBe(Errors.AssignmentNotFound);
        });
    });
});
