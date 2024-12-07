describe('App Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load application', () => {
    cy.get('main').should('exist');
  });
});
