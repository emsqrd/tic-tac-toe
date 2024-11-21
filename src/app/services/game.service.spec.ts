import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { Square } from '../models/square';
import { OutcomeEnum } from '../enums/outcome.enum';

function createEmptyBoard(): Square[] {
  return Array(9).fill({ gamePiece: '', isWinner: false });
}

function setSquare(board: Square[], position: number, piece: string): Square[] {
  const newBoard = [...board];

  newBoard[position] = {
    gamePiece: piece,
    isWinner: false,
  };

  return newBoard;
}

// Validate position is within the range of the game board
function validatePositionRange(position: number) {
  expect(position).toBeGreaterThanOrEqual(0);
  expect(position).toBeLessThanOrEqual(8);
}

describe('GameService', () => {
  let service: GameService;
  const corners = [0, 2, 6, 8];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateWinner', () => {
    it('should return null if there is no winner', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');

      expect(service.calculateWinner(gameBoard)).toBeNull();
    });

    it('should return winning positions for a row win', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 5, 'O');

      expect(service.calculateWinner(gameBoard)).toEqual([0, 1, 2]);
    });

    it('should return winning positions for a column win', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 3, 'O');
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 6, 'O');

      expect(service.calculateWinner(gameBoard)).toEqual([0, 3, 6]);
    });

    it('should return winning positions for a diagonal win', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 5, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      expect(service.calculateWinner(gameBoard)).toEqual([0, 4, 8]);
    });

    it('should return null for an empty board', () => {
      const gameBoard = createEmptyBoard();
      expect(service.calculateWinner(gameBoard)).toBeNull();
    });
  });

  describe('determine outcome', () => {
    it('should return Draw outcome if the board is full and no winner', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 3, 'X');
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 5, 'O');
      gameBoard = setSquare(gameBoard, 6, 'O');
      gameBoard = setSquare(gameBoard, 7, 'X');
      gameBoard = setSquare(gameBoard, 8, 'O');

      expect(service.determineOutcome(gameBoard)).toEqual(OutcomeEnum.Draw);
    });

    it('should return Win outcome for determineOutcome if there is a winner', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 5, 'O');

      expect(service.determineOutcome(gameBoard)).toEqual(OutcomeEnum.Win);
    });

    it('should return None outcome if the board is not full and no winner', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 5, 'O');

      expect(service.determineOutcome(gameBoard)).toEqual(OutcomeEnum.None);
    });
  });

  describe('get random empty square', () => {
    it('should return random index for a CPU move', () => {
      const gameBoard = createEmptyBoard();

      const randomIndex = service.getRandomEmptySquare(gameBoard);
      validatePositionRange(randomIndex);
    });
  });

  describe('medium cpu moves', () => {
    it('should return a cpu winning move if available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 3, 'X');
      gameBoard = setSquare(gameBoard, 4, 'X');

      spyOn(service, 'findWinningMove').and.callThrough();

      const cpuWinMove = service.makeMediumCpuMove(gameBoard);
      validatePositionRange(cpuWinMove);
      expect(service.findWinningMove).toHaveBeenCalledWith(gameBoard, 'O');
    });

    it('should return a blocking move if CPU has no winning move and human has a winning move', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 3, 'O');
      gameBoard = setSquare(gameBoard, 6, 'O');

      spyOn(service, 'findWinningMove').and.callThrough();

      const blockingMove = service.makeMediumCpuMove(gameBoard);
      validatePositionRange(blockingMove);
      expect(service.findWinningMove).toHaveBeenCalledWith(gameBoard, 'X');
    });

    it('should return a corner move if available and CPU and human have no winning moves available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 1, 'X');

      spyOn(service, 'findCornerMove').and.callThrough();

      const cornerMove = service.makeMediumCpuMove(gameBoard);
      validatePositionRange(cornerMove);
      expect(service.findCornerMove).toHaveBeenCalledWith(gameBoard);
    });

    it('should return a random move if no winning, blocking or corner move is available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'O');

      gameBoard = setSquare(gameBoard, 3, 'O');
      gameBoard = setSquare(gameBoard, 4, 'X');

      gameBoard = setSquare(gameBoard, 6, 'X');
      gameBoard = setSquare(gameBoard, 7, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      spyOn(service, 'getRandomEmptySquare').and.callThrough();

      const randomMove = service.makeMediumCpuMove(gameBoard);
      validatePositionRange(randomMove);
      expect(service.getRandomEmptySquare).toHaveBeenCalledWith(gameBoard);
    });
  });

  describe('find winning move', () => {
    it('should return -1 if no winning move is available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'O');
      gameBoard = setSquare(gameBoard, 3, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 5, 'X');
      gameBoard = setSquare(gameBoard, 6, 'X');
      gameBoard = setSquare(gameBoard, 7, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const winningMove = service.findWinningMove(gameBoard, 'O');
      expect(winningMove).toEqual(-1);
    });

    it('should return a winning move for the CPU', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 3, 'X');
      gameBoard = setSquare(gameBoard, 4, 'X');

      const winningMove = service.findWinningMove(gameBoard, 'O');
      expect(winningMove).toEqual(2);
    });

    it('should find winning move in diagonal', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 4, 'O');

      const winningMove = service.findWinningMove(gameBoard, 'O');
      expect(winningMove).toBe(8);
    });

    it('should prioritize win over block', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 3, 'X');
      gameBoard = setSquare(gameBoard, 4, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(2); // Win at position 2 instead of blocking at 5
    });
  });

  describe('find corner move', () => {
    it('should return a corner move if available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 1, 'X');

      const cornerMove = service.findCornerMove(gameBoard);
      expect(corners).toContain(cornerMove);
    });

    it('should return -1 if no corner move is available', () => {
      let gameBoard = createEmptyBoard();

      corners.forEach((corner) => {
        gameBoard = setSquare(gameBoard, corner, 'X');
      });

      const cornerMove = service.findCornerMove(gameBoard);
      expect(cornerMove).toEqual(-1);
    });
  });

  describe('hard cpu moves', () => {
    it('should return a valid move for an empty board', () => {
      const gameBoard = createEmptyBoard();
      const move = service.makeHardCpuMove(gameBoard);
      validatePositionRange(move);
    });

    it('should take winning move when available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 6, 'X');
      gameBoard = setSquare(gameBoard, 2, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(1); // Winning move at position 1
    });

    it('should block opponent winning move', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(2); // Block at position 2
    });

    it('should block opponent winning move in column', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 7, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(3); // Block at position 3
    });

    it('should prefer center over corners in early game', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(4); // Should take center
    });

    it('should handle board with only one move left', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 3, 'O');
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 5, 'O');
      gameBoard = setSquare(gameBoard, 6, 'X');
      gameBoard = setSquare(gameBoard, 8, 'O');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(7); // Only remaining position
    });

    it('should prevent opponent from creating a fork', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      // Should take position 1, 3, 5, or 7 to prevent fork
      expect([1, 3, 5, 7]).toContain(move);
    });

    it('should prefer winning in fewer moves over longer paths', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 7, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(8); // Immediate win over potential fork
    });

    it('should handle edge case where all corners are taken', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 2, 'O');
      gameBoard = setSquare(gameBoard, 6, 'X');
      gameBoard = setSquare(gameBoard, 8, 'O');

      const move = service.makeHardCpuMove(gameBoard);
      validatePositionRange(move);
    });

    it('should block double threat scenarios', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 2, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(1); // Block the double threat
    });

    it('should create a double threat when possible', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 1, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect([0, 2, 6, 8]).toContain(move); // Create double threat opportunity
    });

    it('should handle symmetrical board positions correctly', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 8, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');

      const move = service.makeHardCpuMove(gameBoard);
      expect([1, 3, 5, 7]).toContain(move); // Should take edge to prevent fork
    });

    it('should return draw score in drawn position', () => {
      let gameBoard = createEmptyBoard();
      // Setup a drawn board position
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 3, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 5, 'X');
      gameBoard = setSquare(gameBoard, 6, 'O');
      gameBoard = setSquare(gameBoard, 7, 'X');

      // Leave one move for CPU
      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(8); // Only possible move

      // Complete the board
      gameBoard = setSquare(gameBoard, 8, 'O');

      // Verify it's actually a draw
      expect(service.determineOutcome(gameBoard)).toBe(OutcomeEnum.Draw);
    });

    it('should prevent opponent from creating a fork in corner', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(2); // Should take position 2 to prevent fork
    });
  });

  describe('minimax optimization', () => {
    it('should make optimal moves consistently', () => {
      let gameBoard = createEmptyBoard();
      // Setup a board where there's only one optimal move
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 8, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');

      // Running multiple times should always give the same optimal move
      const moves = new Set();
      for (let i = 0; i < 5; i++) {
        moves.add(service.makeHardCpuMove(gameBoard));
      }

      // Should always choose the same optimal move
      expect(moves.size).toBe(1);
    });

    it('should use memoization to improve performance', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 0, 'X');

      const minimaxSpy = spyOn<any>(service, 'minimax').and.callThrough();

      // First call should compute all values
      service.makeHardCpuMove(gameBoard);
      const firstCallCount = minimaxSpy.calls.count();
      minimaxSpy.calls.reset();

      // Second call should use memoized values and make fewer minimax calls
      service.makeHardCpuMove(gameBoard);
      const secondCallCount = minimaxSpy.calls.count();

      expect(secondCallCount).toBeLessThan(firstCallCount);
    });
  });

  describe('fork opportunity detection', () => {
    it('should detect potential fork in corners', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 8, 'O');

      const move = service.makeHardCpuMove(gameBoard);
      // Should take an edge to force opponent's move and prevent their win
      expect([1, 3, 5, 7]).toContain(move);
    });

    it('should prevent opponent fork in multiple threats scenario', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');
      gameBoard = setSquare(gameBoard, 1, 'O');

      const move = service.makeHardCpuMove(gameBoard);
      // Should take position 7 to block the fork and create a threat
      expect(move).toBe(7);
    });
  });

  describe('performance', () => {
    it('should make a decision in reasonable time', () => {
      const gameBoard = createEmptyBoard();
      const startTime = performance.now();

      service.makeHardCpuMove(gameBoard);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should decide within 1 second
    });
  });

  describe('error handling', () => {
    it('should handle invalid board state gracefully', () => {
      let gameBoard = createEmptyBoard();
      // Create invalid board with more X's than O's
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      validatePositionRange(move);
    });

    it('should handle full board gracefully', () => {
      let gameBoard = createEmptyBoard();
      for (let i = 0; i < 9; i++) {
        gameBoard = setSquare(gameBoard, i, i % 2 === 0 ? 'X' : 'O');
      }

      expect(() => service.makeHardCpuMove(gameBoard)).not.toThrow();
    });

    it('should fallback to random move when error occurs', () => {
      const gameBoard = createEmptyBoard();
      const error = new Error('Test error');

      // Mock getEmptySquares to throw the error instead of findBestMove
      spyOn(service as any, 'getEmptySquares').and.throwError(error.message);
      spyOn(service, 'getRandomEmptySquare').and.returnValue(4);
      spyOn(console, 'error');

      const move = service.makeHardCpuMove(gameBoard);

      expect(move).toBe(4);
      expect(service.getRandomEmptySquare).toHaveBeenCalledWith(gameBoard);
    });

    it('should log error when exception occurs', () => {
      const gameBoard = createEmptyBoard();
      const error = new Error('Test error');
      const consoleSpy = spyOn(console, 'error');

      spyOn(service as any, 'getEmptySquares').and.throwError(error.message);

      service.makeHardCpuMove(gameBoard);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in makeHardCpuMove:',
        error
      );
    });
  });

  describe('memory management', () => {
    it('should clear memoized states during destroy', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');

      // Force memoization
      service.makeHardCpuMove(gameBoard);

      // Access private memoizedStates through ngOnDestroy
      service.ngOnDestroy();

      // Use indirect testing through performance check
      const minimaxSpy = spyOn<any>(service, 'minimax').and.callThrough();
      service.makeHardCpuMove(gameBoard);

      // Should make full calculation again after clear
      expect(minimaxSpy).toHaveBeenCalled();
    });
  });

  describe('minimax edge cases', () => {
    it('should handle deep recursive positions efficiently', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const startTime = performance.now();
      const move = service.makeHardCpuMove(gameBoard);
      const duration = performance.now() - startTime;

      validatePositionRange(move);
      expect(duration).toBeLessThan(100); // Should be fast due to alpha-beta pruning
    });

    it('should maintain consistent decisions after memoization clear', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');

      const firstMove = service.makeHardCpuMove(gameBoard);
      service.ngOnDestroy(); // Clear memoization
      const secondMove = service.makeHardCpuMove(gameBoard);

      expect(firstMove).toBe(secondMove);
    });
  });
});
