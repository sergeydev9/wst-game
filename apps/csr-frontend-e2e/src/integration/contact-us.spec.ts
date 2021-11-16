import { getBySel } from '../support';

describe('contact-us', () => {

    beforeEach(() => {
        cy.visit('https://localhost:4200/contact-us');
    })

    describe('success case', () => {

        it('should show success message and send user back to the home page', () => {

            cy.intercept('POST', "http://localhost:3000/emails", {
                statusCode: 201
            }).as('success');

            // fill in name
            getBySel('contact-name').type('test');

            // fill in email
            getBySel('contact-email').type('test@test.com');

            // fill in message
            getBySel('contact-message').type('this is a test message');

            // submit
            getBySel('contact-submit').click();

            cy.wait('@success').then(() => {
                getBySel('message-modal').should('be.visible').contains('Thank you for your input!')
                cy.url().should('equal', 'http://localhost:4200/')
            })
        })
    })

})