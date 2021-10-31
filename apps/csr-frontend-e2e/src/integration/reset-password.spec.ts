
context('/reset/send-email', () => {
    beforeEach(() => {
        cy.visit('https://localhost:4200/reset/send-email');
    })

    describe('reset limit reached', () => {
        beforeEach(() => {
            cy.get('input').type('email@email.com')
        })

        it('should show reset limit reached error message', () => {

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
})