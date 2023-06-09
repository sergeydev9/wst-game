import supertest from 'supertest';
import { Application } from 'express';
import App from '../../App';

describe('names routes', () => {
    let app: Application;

    beforeAll(() => {
        app = new App().app;
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('[PATCH] /report', () => {
        it('should return 204 if there are both seen and chosen fields', (done) => {
            supertest(app)
                .patch('/names/report')
                .send({ seen: [1, 3], chosen: 3 })
                .expect(204, done)
        })

        it('should return 204 if there is only seen but not chosen', (done) => {
            supertest(app)
                .patch('/names/report')
                .send({ seen: [1, 3] })
                .expect(204, done)
        })


        it('should return 422 if a value in seen is invalid', (done) => {
            supertest(app)
                .patch('/names/report')
                .send({ seen: [1, 'a'], chosen: 3 })
                .expect(422, done)
        })


        it('should return 422 if chosen is invalid', (done) => {
            supertest(app)
                .patch('/names/report')
                .send({ seen: [1, 2], chosen: 'a' })
                .expect(422, done)
        })
    })

})