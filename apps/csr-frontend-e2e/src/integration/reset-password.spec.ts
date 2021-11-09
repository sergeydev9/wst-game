
context('/reset/send-email', () => {
    beforeEach(() => {
        cy.visit('https://localhost:4200/reset/send-email');
        cy.get('input').type('email@email.com')
    })

    describe('reset limit reached', () => {

        it('should show reset limit reached error message if server responds with 403', () => {

            cy.intercept('POST', "http://localhost:3000/user/send-reset", {
                statusCode: 403,
                body: 'Reset limit reached'
            }).as('limitReached')

            cy.getBySel('submit-send-reset').click();

            cy.wait('@limitReached').then(() => {
                cy.get('[data-cy=message-modal]').should('be.visible').contains('Daily reset attempt limit reached. You can try again in 24 hours.')
            })
        })
    })

    describe('success response', () => {

        it('should send to enter code page if server responds with 202', () => {

            cy.intercept('POST', "http://localhost:3000/user/send-reset", {
                statusCode: 202
            }).as('success');

            cy.getBySel('submit-send-reset').click();
            cy.wait('@success').then(() => {
                cy.url().should('contain', '/reset/enter-code')
            })
        })
    })
})

context('/reset/enter-code', () => {
    beforeEach(() => {

        // successfull request a reset code generation
        cy.visit('https://localhost:4200/reset/send-email');
        cy.get('input').type('email@email.com');

        cy.intercept('POST', "http://localhost:3000/user/send-reset", {
            statusCode: 202
        })
        cy.getBySel('submit-send-reset').click();
    })

    it('should send user back if they click on the send again button', () => {
        cy.getBySel('send-again').click().then(() => {
            cy.url().should('contain', '/reset/send-email')
            cy.getState().then(state => expect(state.resetPassword.email).to.equal(''))

        });

    })
})