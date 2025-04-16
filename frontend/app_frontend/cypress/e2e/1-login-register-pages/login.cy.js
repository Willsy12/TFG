describe('LoginPage', () => {
  beforeEach(() => {
    cy.deleteUser(Cypress.env('username'));
    cy.visit('Login'); // Asegúrate de que esta ruta sea la correcta para tu página de login
  });

  it('should display the register form', () => {
    cy.get('form').should('be.visible');
    cy.get('input[formControlName="username"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');

    cy.get('button[type="submit"]').should('contain', 'Registrarse');
  });

  it('should display an error message for invalid register', () => {
    cy.get('button[type="submit"]').click();

    cy.get('span.text-danger').and('contain', 'Todos los campos son obligatorios');
  });

  it('should diplay login page on successful register', () => {
    cy.get('input[formControlName="username"]').type(Cypress.env('username'));
    cy.get('input[formControlName="password"]').type(Cypress.env('password'));
    cy.get('input[formControlName="email"]').type(Cypress.env('email'));

    cy.get('button[type="submit"]').click();

    cy.get('form').should('be.visible');
    cy.get('input[formControlName="username"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Iniciar sesión');
  });

  it('should display principal page on successful login', () => {
    cy.deleteUsers();

    cy.get('input[formControlName="username"]').type(Cypress.env('username'));
    cy.get('input[formControlName="password"]').type(Cypress.env('password'));
    cy.get('input[formControlName="email"]').type(Cypress.env('email'));

    cy.get('button[type="submit"]').click();

    cy.wait(3000);

    cy.get('form').should('be.visible');
    cy.get('input[formControlName="username"]').type(Cypress.env('username'));
    cy.get('input[formControlName="password"]').type(Cypress.env('password'));

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/');
  });
});
