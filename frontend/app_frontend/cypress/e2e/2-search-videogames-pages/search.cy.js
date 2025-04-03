describe('MainPage', () => {
  beforeEach(() => {
    cy.deleteUser(Cypress.env('username'));
    cy.createUser(Cypress.env('username'), Cypress.env('password'), Cypress.env('email'));
    cy.login(Cypress.env('username'), Cypress.env('password'));
  });

  it('showDisplayAllVideogames', () => {
    cy.visit('Inicio');
    cy.wait(2000);

    cy.get('form').should('be.visible');
    cy.get('input[formControlName="titulo"]').should('be.visible');
    cy.get('button').should('be.visible').contains('Buscar').should('have.class', 'green-color');
    cy.get('button[type=button]').should('be.visible').contains('Mostrar filtros');
  });

  it('showDisplayAllVideogamesWithAdvancedFilters', () => {
    cy.visit('Inicio');
    cy.wait(2000);

    cy.get('form').should('be.visible');
    cy.get('input[formControlName="titulo"]').should('be.visible');
    cy.get('button[type=button]').should('be.visible').contains('Mostrar filtros').click();

    cy.get('select[formControlName="genero"]').should('be.visible');
    cy.get('input[formControlName="añoLanzamiento"]').should('be.visible');
    cy.get('input[formControlName="desarrolladora"]').should('be.visible');
    cy.get('button[type=button]').should('be.visible').contains('Ocultar filtros');
    cy.get('button').should('be.visible').contains('Buscar').should('have.class', 'green-color');
  });

  it('searchVideogameWithAdvancedFilter', () => {
    cy.visit('Inicio');
    cy.wait(2000);

    cy.get('form').should('be.visible');
    cy.get('input[formControlName="titulo"]').should('be.visible');
    cy.get('button[type=button]').should('be.visible').contains('Mostrar filtros').click();

    cy.get('select[formControlName="genero"]').should('be.visible').select('Accion');
    cy.get('input[formControlName="añoLanzamiento"]').should('be.visible').type('2020');
    cy.get('input[formControlName="desarrolladora"]').should('be.visible');
    cy.get('button[type=button]').should('be.visible').contains('Ocultar filtros');
    cy.get('button')
      .should('be.visible')
      .contains('Buscar')
      .should('have.class', 'green-color')
      .click();
    cy.get('img');
  });

  it('displayNoneVideogame', () => {
    cy.visit('Inicio');
    cy.wait(2000);

    cy.get('form').should('be.visible');
    cy.get('input[formControlName="titulo"]').should('be.visible').type('NOT FOUND');
    cy.get('button[type=button]').should('be.visible').contains('Mostrar filtros').click();

    cy.get('select[formControlName="genero"]').should('be.visible').select('Accion');
    cy.get('input[formControlName="añoLanzamiento"]').should('be.visible').type('2027');
    cy.get('input[formControlName="desarrolladora"]').should('be.visible');
    cy.get('button[type=button]').should('be.visible').contains('Ocultar filtros');
    cy.get('button')
      .should('be.visible')
      .contains('Buscar')
      .should('have.class', 'green-color')
      .click();
    cy.wait(2000);
    cy.get('h2').contains('Ningun videojuego encontrado');
  });
});
