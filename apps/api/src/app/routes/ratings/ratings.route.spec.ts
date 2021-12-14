import supertest from 'supertest';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import { signGameToken, signUserPayload } from '@whosaidtrue/middleware';
import { questionRatings, appRatings } from '../../db';
import App from '../../App';
import { QueryResult } from 'pg';

jest.mock('../../db')

const mockedQuestionRatings = mocked(questionRatings, true);
const mockedAppRatings = mocked(appRatings, true);

describe('ratings routes', () => {
    let app: Application;
    const validToken = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
    const gameToken = signGameToken(14, 'Test Player', false, 17);

    beforeAll(() => {
        app = new App().app;
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('[POST] /question', () => {
        it('should return 201 with value "great"', (done) => {

            mockedQuestionRatings.submitRating.mockResolvedValue({ rowCount: 1 } as QueryResult)
            supertest(app)
                .post('/ratings/question')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ gameToken, questionId: 123, rating: 'great' })
                .expect(201, done)
        })

        it('should return 201 with value "bad"', (done) => {
            // mockedQuestionRatings.submitRating.mockResolvedValue({ rowCount: 1 } as QueryResult)
            supertest(app)
                .post('/ratings/question')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ gameToken, questionId: 123, rating: 'bad' })
                .expect(201, done)
        })

        it('should return 422 with some other string', (done) => {
            supertest(app)
                .post('/ratings/question')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ gameToken, questionId: 123, rating: 'bads' })
                .expect(422, done)
        })

        // DM: allow anonymous players to submit ratings
        it('should return 201 if no valid token', (done) => {
            supertest(app)
                .post('/ratings/question')
                .send({ gameToken, questionId: 123, rating: 'bad' })
                .expect(201, done)
        })


        it('should respond with 500 if error', (done) => {
            mockedQuestionRatings.submitRating.mockRejectedValue(new Error('error'))

            supertest(app)
                .post('/ratings/question')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ gameToken, questionId: 123, rating: 'bad' })
                .expect(500, done)
        })
    })

    describe('[GET] /question', () => {

        it('should return 200 with value "true" if there is a rating', (done) => {

            mockedQuestionRatings.getByUserId.mockResolvedValue({ rowCount: 1 } as QueryResult)
            supertest(app)
                .get('/ratings/question?id=123')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body.hasRated).toEqual(true);
                    done();
                })
                .catch(err => done(err))
        })


        it('should return 200 with value "false" if no rating found', (done) => {
            mockedQuestionRatings.getByUserId.mockResolvedValue({ rowCount: 0 } as QueryResult)

            supertest(app)
                .get('/ratings/question?id=123')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body.hasRated).toEqual(false);
                    done();
                })
                .catch(err => done(err))
        })

        it('should respond with 422 if no valid question id param', (done) => {
            supertest(app)
                .get('/ratings/question?')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(422, done)

        })

        it('should return 401 if no valid token', (done) => {
            supertest(app)
                .get('/ratings/question?id=123')
                .expect(401, done)
        })

        it('should respond with 500 if error', (done) => {
            mockedQuestionRatings.getByUserId.mockRejectedValue(new Error('error'))

            supertest(app)
                .get('/ratings/question?id=123')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(500, done)
        })
    })

    describe('[POST] /app', () => {
        it('should return 201 with value "great"', (done) => {
            supertest(app)
                .post('/ratings/app')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ rating: 'great' })
                .expect(201, done)
        })

        it('should return 201 with value "bad"', (done) => {
            supertest(app)
                .post('/ratings/app')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ rating: 'bad' })
                .expect(201, done)
        })

        it('should return 422 with some other string', (done) => {
            supertest(app)
                .post('/ratings/app')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ rating: 'bads' })
                .expect(422, done)
        })

        it('should return 401 if no valid token', (done) => {
            supertest(app)
                .post('/ratings/app')
                .send({ rating: 'bad' })
                .expect(401, done)
        })
    })

    describe('[GET] /app', () => {

        it('should return 200 with value "true" if there is a rating', (done) => {
            mockedAppRatings.getByUserId.mockResolvedValue({ rowCount: 1 } as QueryResult)

            supertest(app)
                .get('/ratings/app')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body.hasRated).toEqual(true);
                    done();
                })
                .catch(err => done(err))
        })


        it('should return 200 with value "false" if no rating found', (done) => {
            mockedAppRatings.getByUserId.mockResolvedValue({ rowCount: 0 } as QueryResult)

            supertest(app)
                .get('/ratings/app')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body.hasRated).toEqual(false);
                    done();
                })
                .catch(err => done(err))
        })

        it('should return 401 if no valid token', (done) => {
            supertest(app)
                .get('/ratings/app')
                .expect(401, done)
        })

        it('should respond with 500 if error', (done) => {
            mockedAppRatings.getByUserId.mockRejectedValue(new Error('error'))

            supertest(app)
                .get('/ratings/app')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(500, done)
        })
    })
})
