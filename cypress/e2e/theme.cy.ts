describe('Theme Switching', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('persists theme selection after page reload', () => {
    // Toggle theme
    cy.get('[data-testid="theme-toggle"]').click();

    // Verify dark mode is applied
    cy.get('html').should('have.class', 'dark-mode');
    cy.get('body')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(34, 37, 42)');

    // Reload and verify persistence
    cy.reload();
    cy.get('html').should('have.class', 'dark-mode');
    cy.get('body')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(34, 37, 42)');
  });

  it('toggles between light and dark themes correctly', () => {
    // Verify initial light theme
    cy.get('html').should('not.have.class', 'dark-mode');
    cy.get('body')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(245, 245, 245)');

    // Toggle to dark theme
    cy.get('[data-testid="theme-toggle"]').click();
    cy.get('html').should('have.class', 'dark-mode');
    cy.get('body')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(34, 37, 42)');

    // Toggle back to light theme
    cy.get('[data-testid="theme-toggle"]').click();
    cy.get('html').should('not.have.class', 'dark-mode');
    cy.get('body')
      .should('have.css', 'background-color')
      .and('eq', 'rgb(245, 245, 245)');
  });
});
