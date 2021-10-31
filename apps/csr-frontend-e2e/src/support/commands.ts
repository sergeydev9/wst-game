// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import { Store } from 'redux';
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      loginUser(): void;
      getBySel(selector: string): any;
      fillInValidAuth(): void;
      store(): Store;
      getState(): any;
      subscribe(): any;

    }
  }
}
Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});


/**
 * loginUser
 */
Cypress.Commands.add("loginUser", () => {
  const log = Cypress.log({
    name: "loginUser",
    displayName: "LOGIN USER",
    message: [`🔐 Authenticating | User`],
    autoEnd: true,
  });

  cy.intercept("POST", "http://localhost:3000/user/login").as("login");

  cy.visit("/login", { log: false }).then(() => {
    log.snapshot("before");
  });

  cy.getBySel('email-input').type('cypress-test-user@email.com');
  cy.getBySel('password-input').type('Password123');
  cy.getBySel('login-submit').click()

  cy.wait("@login").then((loginUser) => {
    log.set({
      consoleProps() {
        return {
          token: loginUser.response.body.token,
        };
      },
    });
  });

});


/**
 * Fill in auth
 */
Cypress.Commands.add('fillInValidAuth', () => {
  const log = Cypress.log({
    name: "fillInValidAuth",
    displayName: "ENTER CREDENTIALS",
    message: [`✏️ |  Filling Inputs`],
    autoEnd: true,
  });

  log.snapshot('before')
  cy.getBySel('email-input').type('cypress-test-user@email.com');
  cy.getBySel('password-input').type('Password123');

  log.snapshot('after')
})

/**
 * store
 */
Cypress.Commands.add('store', () => {
  return cy
    .log('Redux - Store')
    .window({ log: false })
    .its('store')
})


/**
 * get state
 */
Cypress.Commands.add('getState', (node) => {
  return node
    ? cy
      .log(`Redux - state[${node}]`)
      .window({ log: false })
      .its('store')
      .invoke('getState')
      .its(node.toString())
    : cy
      .log('Redux - State')
      .window({ log: false })
      .its('store')
      .invoke('getState')
})

Cypress.Commands.add('dispatch', (action = { type: 'NO_OP' }) => {
  const { type, ...params } = action
  return cy
    .log(`Redux - Dispatch: ${type}`, params)
    .window({ log: false })
    .its('store')
    .invoke('dispatch', action)
})

Cypress.Commands.add('subscribe', (callback = (...args) => console.warn('CB:', args)) => {
  return cy
    .log('Redux - Subscribe')
    .window({ log: false })
    .its('store')
    .invoke('subscribe', callback)
})