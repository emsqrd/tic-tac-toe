describe('Game Board', () => {
  beforeEach(() => {
    cy.visit('/');
    // Best practice: ensure consistent viewport size
    cy.viewport(1280, 720);
  });

  // Best practice: test should be independent and atomic
  it('should render initial game board state correctly', () => {
    cy.get('[data-testid="game-board"]').should('exist').and('be.visible');

    cy.get('[data-testid="board-square"]')
      .should('have.length', 9)
      .each(($square) => {
        cy.wrap($square)
          .should('not.have.class', 'x')
          .and('not.have.class', 'o');
      });
  });

  it('should display correct initial game mode and player turn', () => {
    cy.get('[data-testid="game-mode-button"]').should('be.visible');

    cy.get('[data-testid="game-mode-2p')
      .should('exist')
      .and('have.class', 'fa-user-group');

    cy.get('[data-testid="player-1"]').should('have.class', 'select-result');
    cy.get('[data-testid="player-1-score"]').should(
      'have.class',
      'select-result'
    );

    cy.get('[data-testid="player-2"]').should(
      'not.have.class',
      'select-result'
    );
    cy.get('[data-testid="player-2-score"]').should(
      'not.have.class',
      'select-result'
    );
  });

  it('should handle player moves correctly', () => {
    // Best practice: create custom command for making moves
    cy.get('[data-testid="board-square"]').first().as('firstSquare');

    cy.get('@firstSquare').click();

    // Best practice: more specific assertions
    cy.get('@firstSquare')
      .find('[data-testid="square-content"]')
      .should('have.class', 'x')
      .and('be.visible');

    // Best practice: verify game state changes
    cy.get('[data-testid="player-1"]').should(
      'not.have.class',
      'select-result'
    );
    cy.get('[data-testid="player-2"]').should('have.class', 'select-result');

    // Best practice: verify square can't be clicked again
    cy.get('@firstSquare').click();
    cy.get('@firstSquare')
      .find('[data-testid="square-content"]')
      .should('have.class', 'x');
  });

  // Best practice: test error states
  it('should handle invalid moves gracefully', () => {
    cy.get('[data-testid="board-square"]').first().click();
    cy.get('[data-testid="board-square"]').first().click();
    // Verify no changes occurred on invalid move
    cy.get('[data-testid="board-square"]')
      .first()
      .find('[data-testid="square-content"]')
      .should('have.class', 'x')
      .and('not.have.class', 'o');
  });
});
