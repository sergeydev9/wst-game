import supertest from 'supertest';
import { Application } from 'express';

import App from '../../App';


describe('/names routes', () => {
    let app: Application;

    beforeAll(() => {
        app = new App().app;
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('[PATCH] /report', () => {
        it('should return 204 if validation passes', (done) => {
            supertest(app)
                .patch('/names/report')
                .send({ seen: [1, 3], chosen: 3 })
                .expect(204, done)
        })

        it('should return 422 if validation fails', (done) => {
            supertest(app)
                .patch('/names/report')
                .send({ seen: [1, 'a'], chosen: 3 })
                .expect(422, done)
        })
    })

})
