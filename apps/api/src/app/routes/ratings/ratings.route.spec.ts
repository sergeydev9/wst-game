import supertest from 'supertest';
import { Application } from 'express';
import { signUserPayload } from '@whosaidtrue/middleware';
import App from '../../App';


describe('ratings routes', () => {
    let app: Application;
    const validToken = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })

    beforeAll(() => {
        app = new App().app;
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('[POST] /question', () => {
        it('should return 204 with value "great"', (done) => {
            supertest(app)
                .post('/ratings/question')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ questionId: 123, value: 'great' })
                .expect(204, done)
        })

        it('should return 204 with value "bad"', (done) => {
            supertest(app)
                .post('/ratings/question')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ questionId: 123, value: 'bad' })
                .expect(204, done)
        })

        it('should return 422 with some other string', (done) => {
            supertest(app)
                .post('/ratings/question')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ questionId: 123, value: 'bads' })
                .expect(422, done)
        })

        it('should return 401 if no valid token', (done) => {
            supertest(app)
                .post('/ratings/question')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ questionId: 123, value: 'bad' })
                .expect(401, done)
        })
    })

    describe('[GET] /question', () => {

        it('should return 200 with value "true" if there is a rating', (done) => {
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
                .expect(422)
                .catch(err => done(err))

        })

        it('should return 401 if no valid token', (done) => {
            supertest(app)
                .get('/ratings/question')
                .expect(401, done)
        })
    })

    describe('[POST] /app', () => {
        it('should return 204 with value "great"', (done) => {
            supertest(app)
                .post('/ratings/app')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ questionId: 123, value: 'great' })
                .expect(204, done)
        })

        it('should return 204 with value "bad"', (done) => {
            supertest(app)
                .post('/ratings/app')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ questionId: 123, value: 'bad' })
                .expect(204, done)
        })

        it('should return 422 with some other string', (done) => {
            supertest(app)
                .post('/ratings/app')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ questionId: 123, value: 'bads' })
                .expect(422, done)
        })

        it('should return 401 if no valid token', (done) => {
            supertest(app)
                .post('/ratings/app')
                .send({ questionId: 123, value: 'bad' })
                .expect(401, done)
        })
    })

    describe('[GET] /app', () => {

        it('should return 200 with value "true" if there is a rating', (done) => {
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
                .get('/ratings/question')
                .expect(401, done)
        })
    })
})
