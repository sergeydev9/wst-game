
describe('csr-frontend', () => {
  beforeEach(() => cy.visit('https://localhost:4200'));

  it('should log in', () => {
    cy.loginUser();
    expect(localStorage.getItem('wstState')).to.exist;
  });
});
