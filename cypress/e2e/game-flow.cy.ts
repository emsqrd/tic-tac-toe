describe('Game Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.viewport(1280, 720);
  });

  it('should complete a full game with win scenario', () => {
    // Play a winning pattern
    cy.get('[data-testid="board-square"]').eq(0).click(); // X
    cy.get('[data-testid="board-square"]').eq(3).click(); // O
    cy.get('[data-testid="board-square"]').eq(1).click(); // X
    cy.get('[data-testid="board-square"]').eq(4).click(); // O
    cy.get('[data-testid="board-square"]').eq(2).click(); // X wins

    // Verify winning state
    cy.get('[data-winner="true"]').should('have.length', 3);
    cy.get('.strike-through').should('exist');

    // Verify score updated
    cy.get('[data-testid="player-1-score"]').should('contain', '1');

    // Verify new game starts on next move
    cy.get('[data-testid="board-square"]').eq(5).click();
    cy.get('[data-winner="true"]').should('not.exist');
    cy.get('.strike-through').should('not.exist');
  });

  it('should handle game mode switching', () => {
    // Switch to single player
    cy.get('[data-testid="game-mode-button"]').click();
    cy.get('[data-testid="game-mode-button"]').should('contain', '1P');

    // Verify CPU moves after human move
    cy.get('[data-testid="board-square"]').eq(4).click();
    cy.get('[data-testid="board-square"]')
      .find('[data-testid="square-content"].o')
      .should('exist');
  });

  it('should handle difficulty changes in single player mode', () => {
    // Switch to single player
    cy.get('[data-testid="game-mode-button"]').click();

    // Cycle through difficulties
    cy.get('[data-testid="difficulty-button"]').should('contain', 'Easy');
    cy.get('[data-testid="difficulty-button"]').click();
    cy.get('[data-testid="difficulty-button"]').should('contain', 'Medium');
    cy.get('[data-testid="difficulty-button"]').click();
    cy.get('[data-testid="difficulty-button"]').should('contain', 'Hard');

    // Verify CPU behavior changes (check for blocking move in Hard mode)
    cy.get('[data-testid="board-square"]').eq(0).click(); // X in corner
    cy.get('[data-testid="board-square"]')
      .eq(4)
      .find('[data-testid="square-content"].o')
      .should('exist'); // O in center
    cy.get('[data-testid="board-square"]').eq(8).click(); // X in opposite corner
    // CPU should block fork by taking an edge
    cy.get('[data-testid="board-square"]')
      .eq(7)
      .find('[data-testid="square-content"].o')
      .should('exist');
  });

  it('should properly handle draw scenario', () => {
    // Play moves leading to draw
    const drawMoves = [0, 1, 2, 4, 3, 6, 5, 8, 7];
    drawMoves.forEach((pos) => {
      cy.get('[data-testid="board-square"]').eq(pos).click();
    });

    // Verify board is in draw state
    cy.get('[data-draw="true"]').should('exist');

    // Verify clicking after draw starts a new game
    cy.get('[data-testid="board-square"]').eq(0).click();
    cy.get('[data-draw="true"]').should('not.exist');
  });
});
