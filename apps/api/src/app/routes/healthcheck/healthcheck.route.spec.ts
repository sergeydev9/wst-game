import supertest from 'supertest';
import App from '../../App';


describe('[GET] /healthz', () => {
    const { app } = new App()
    it('should respond with 200 OK', async () => {
        await supertest(app)
            .get('/healthz')
            .expect(200)
    })
})