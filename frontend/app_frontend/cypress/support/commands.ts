/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
const PYTHON = '/Users/willsy12/Desktop/Development/TFG/backend/venv/bin/python';
const MANAGE = '/Users/willsy12/Desktop/Development/TFG/backend/app_backend/manage.py';
Cypress.Commands.add('deleteUsers', () => {
  var command =
    ' # fill free to modify the path to python3 and manage.py' +
    '\n' +
    'export _PYTHON=' +
    PYTHON +
    '\n' +
    'export _MANAGE=' +
    MANAGE +
    '\n' +
    '# nothing to modify before this line\n' +
    '\n' +
    'cat <<EOF | ${_PYTHON} ${_MANAGE} shell\n' +
    'from django.contrib.auth import get_user_model\n' +
    'User = get_user_model()  # get the currently active user model,\n' +
    'User.objects.all().delete()\n';
  ('EOF\n');
  cy.exec(command);
});

Cypress.Commands.add('createUser', (username: string, password: string, email: string = '') => {
  const command =
    ' # fill' +
    '\n' +
    'export _PYTHON=' +
    PYTHON +
    '\n' +
    'export _MANAGE=' +
    MANAGE +
    '\n' +
    '# nothing to modify before this line\n' +
    '\n' +
    'cat <<EOF | ${_PYTHON} ${_MANAGE} shell\n' +
    'from django.contrib.auth import get_user_model\n' +
    'User = get_user_model()\n' +
    `if not User.objects.filter(username="${username}").exists():\n` +
    `    User.objects.create_user(username="${username}", password="${password}", email="${email}")\n` +
    'EOF\n';
  cy.exec(command);
});

Cypress.Commands.add('deleteUser', (username: string) => {
  const command =
    ' # fill free to modify the path to python3 and manage.py' +
    '\n' +
    'export _PYTHON=' +
    PYTHON +
    '\n' +
    'export _MANAGE=' +
    MANAGE +
    '\n' +
    '# nothing to modify before this line\n' +
    '\n' +
    'cat <<EOF | ${_PYTHON} ${_MANAGE} shell\n' +
    'from django.contrib.auth import get_user_model\n' +
    'User = get_user_model()\n' +
    `if User.objects.filter(username="${username}").exists():\n` +
    `    User.objects.filter(username="${username}").delete()\n` +
    'EOF\n';
  cy.exec(command);
});

Cypress.Commands.add('login', (username: string, password: string) => {
  const LOGIN_URL = 'http://127.0.0.1:8000/api/v1/login/';

  cy.request({
    method: 'POST',
    url: LOGIN_URL,
    body: {
      username: username,
      password: password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    const token = response.body.auth_token;

    window.localStorage.setItem('token', token);
  });
});
