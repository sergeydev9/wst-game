
describe('login', () => {
  beforeEach(() => cy.visit('https://localhost:4200'));

  context('log in success', () => {

    beforeEach(() => {
      cy.loginUser();
    })

    it('should log in', () => {
      expect(localStorage.getItem('wstState')).to.exist;
    });

  })

});
