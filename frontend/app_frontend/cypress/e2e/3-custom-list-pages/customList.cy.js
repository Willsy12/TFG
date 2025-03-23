describe('MainPage', () => {
  beforeEach(() => {
    cy.deleteUser(Cypress.env('username'));
    cy.createUser(Cypress.env('username'), Cypress.env('password'), Cypress.env('email'));
    cy.login(Cypress.env('username'), Cypress.env('password'));
  });

  it('displayCustomListView', () => {
    cy.visit('Inicio/Mis-Listas');
    cy.wait(2000);
    cy.get('button.green-color').contains('Crear lista');
  });

  it('displayFormCreateCustomList', () => {
    cy.visit('Inicio/Mis-Listas');
    cy.wait(2000);
    cy.get('button.green-color').contains('Crear lista').click();
    cy.get('div.text-end').should('exist');

    cy.get('div.text-end button.cancel-button').should('exist').contains('Cancelar');
    cy.get('div.text-end button.accept-button').should('exist').contains('Aceptar');
  });
});
