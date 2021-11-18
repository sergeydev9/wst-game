import { getBySel, fillInValidAuth } from '../support';

describe('create account', () => {

    beforeEach(() => {
        cy.visit('https://localhost:4200')

        getBySel('create-account').click()

    });

    context('email in use', () => {
        beforeEach(() => {
            cy.intercept('POST', "http://localhost:3000/user/register", {
                statusCode: 422,
                body: "A user already exists with that email"
            }).as("emailInUse");
        })

        it('Should show email in use message if 422 response from api with link to password reset page', () => {
            fillInValidAuth();
            getBySel('login-submit').click();

            cy.wait('@emailInUse').then(() => {
                getBySel('email-in-use').should('exist');
                getBySel('in-use-reset-link').click()
                cy.url().should('contain', '/reset/send-email');
            })

        })

    })


});
