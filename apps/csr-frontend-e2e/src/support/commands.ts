// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
/// <reference types="cypress" />



export function getBySel(selector: string, ...args: unknown[]) {
  return cy.get(`[data-cy=${selector}]`, ...args);
};


/**
 * loginUser
 */
export function loginUser() {
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

  getBySel('email-input').type('cypress-test-user@email.com');
  getBySel('password-input').type('Password123');
  getBySel('login-submit').click()

  cy.wait("@login").then((loginUser) => {
    log.set({
      consoleProps() {
        return {
          token: loginUser.response.body.token,
        };
      },
    });
  });

};


/**
 * Fill in auth
 */
export function fillInValidAuth() {
  const log = Cypress.log({
    name: "fillInValidAuth",
    displayName: "ENTER CREDENTIALS",
    message: [`✏️ |  Filling Inputs`],
    autoEnd: true,
  });

  log.snapshot('before')
  getBySel('email-input').type('cypress-test-user@email.com');
  getBySel('password-input').type('Password123');

  log.snapshot('after')
}

export function getState() {
  return cy.window().its('store').invoke('getState')
}