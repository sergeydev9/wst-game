import { Sequelize } from 'sequelize';
import * as request from 'supertest';
import App from '../App';
import DeckRoute from '../routes/decks.route';
import { CreateUserDto } from '@whosaidtrue/middleware';
import AuthRoute from '../routes/auth.route';
import * as bcrypt from 'bcrypt';

const userData: CreateUserDto = {
  email: 'decktest@email.com',
  password: 'whosaidtrue',
};
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Decks', () => {
  describe('[GET] /decks', () => {
    it('response findAll decks without logged in user fail', async () => {
      const deckRoute = new DeckRoute();
      const app = new App([deckRoute.router]);
      return request(app.getServer()).get(`${deckRoute.path}`).expect(401);
    });
    it('response findAll decks with logged in user', async () => {
      const authRoute = new AuthRoute();
      const deckRoute = new DeckRoute();
      const decks = deckRoute.deckController.deckService.decks;
      const users = authRoute.authController.authService.users;

      decks.findAll = jest.fn().mockReturnValue([
        {
          id: 1,
          deckSortOrder: 1,
          deckName: 'test 1',
          deckClean: '',
          deckAgeRating: '18+',
          deckMovieRating: '18+',
          deckSFW: 'SFW',
          deckStatus: 'Active',
          deckDesc: 'Test playing',
          deckPrice: 0,
          deckPurchaseCount: 0,
          deckOriginalPrice: false,
          deckPlayCount: 0,
          deckFavoritesCount: 0,
          deckRatingGreat: 0,
          deckRatingBad: 0,
          deckPercentGreat: 0,
          deckType: 'type',
        },
        {
          id: 2,
          deckSortOrder: 2,
          deckName: 'test 2',
          deckClean: '',
          deckAgeRating: '18+',
          deckMovieRating: '18+',
          deckSFW: 'SFW',
          deckStatus: 'Active',
          deckDesc: 'Test playing',
          deckPrice: 10,
          deckPurchaseCount: 0,
          deckOriginalPrice: false,
          deckPlayCount: 0,
          deckFavoritesCount: 0,
          deckRatingGreat: 0,
          deckRatingBad: 0,
          deckPercentGreat: 0,
          deckType: 'type',
        },
      ]);

      users.findOne = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (Sequelize as any).authenticate = jest.fn();
      const app = new App([authRoute.router, deckRoute.router]);
      request(app.getServer())
        .post(`${authRoute.path}login`)
        .send(userData)
        .end((err, res) => {
          const jwt = res.body.token.jwt;
          request(app.getServer())
            .get(`${deckRoute.path}`)
            .set('Authorization', 'Bearer ' + jwt)
            .expect(200)
            .end((err, res1) => {
              expect(res1.body.data.allDecks.length).toEqual(2);
            });
        });
    });
  });
});
