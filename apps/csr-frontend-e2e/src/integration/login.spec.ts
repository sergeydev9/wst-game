
import { loginUser } from '../support';

describe('login', () => {
  beforeEach(() => cy.visit('https://localhost:4200'));

  context('log in success', () => {

    beforeEach(() => {
      loginUser();
    })

    it('should log in', () => {
      expect(localStorage.getItem('wstState')).to.exist;
    });

  })

});
