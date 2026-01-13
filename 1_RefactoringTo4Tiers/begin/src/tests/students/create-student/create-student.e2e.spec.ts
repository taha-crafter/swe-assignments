import { defineFeature, loadFeature } from 'jest-cucumber';
import supertest from 'supertest';
import { app } from '@/app';
import { DatabaseFixture } from '@/tests/fixtures/database.fixture'
import { Errors } from '@/shared/constants';

const feature = loadFeature('src/tests/students/create-student/create-student.feature');


defineFeature(feature, (test) => {

    const db = new DatabaseFixture();

    beforeEach(async () => {
        await db.resetDatabase();
    });

    afterAll(async () => {
        await db.disconnect();
    })


    test('Create a new student with valid data', ({ when, then }) => {
        let response: supertest.Response;

        when(/I create a new student with the name "(.*)"$/, async (name: string) => {
            response = await supertest(app).post('/students').send({ name });
        });

        then(/the student "(.*)" should be added to the system$/, (name: string) => {
            expect(response.body.data.name).toBe(name);
        });
    });

    test('Try to create a student without name', ({ when, then, and }) => {
        let response: supertest.Response;

        when('I try to create a student without a name', async () => {
            response = await supertest(app).post('/students').send({});
        });

        then('the student should not be created', () => {
            expect(response.status).toBe(400);
        });
        and('I should receive an invalid input error', () => {
            expect(response.body.error).toBe(Errors.ValidationError);
        });
    });
})
