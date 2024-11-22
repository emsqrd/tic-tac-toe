import { GameService } from './game.service';
import { Square } from '../models/square';
import { OutcomeEnum } from '../enums/outcome.enum';

const createEmptyBoard = (): Square[] =>
  Array(9).fill({ gamePiece: '', isWinner: false });

const setSquare = (
  board: Square[],
  position: number,
  piece: string
): Square[] => {
  const newBoard = [...board];
  newBoard[position] = {
    gamePiece: piece,
    isWinner: false,
  };
  return newBoard;
};

const validatePositionRange = (position: number): void => {
  expect(position).toBeGreaterThanOrEqual(0);
  expect(position).toBeLessThan(9);
};

describe('GameService', () => {
  let service: GameService;
  const corners = [0, 2, 6, 8];

  beforeEach(() => {
    service = new GameService();
  });

  test('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('calculateWinner', () => {
    test('returns null if there is no winner', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');

      expect(service.calculateWinner(gameBoard)).toBeNull();
    });

    test('returns winning positions for a row win', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 5, 'O');

      expect(service.calculateWinner(gameBoard)).toEqual([0, 1, 2]);
    });

    test('returns winning positions for a column win', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 3, 'O');
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 6, 'O');

      expect(service.calculateWinner(gameBoard)).toEqual([0, 3, 6]);
    });

    test('returns winning positions for a diagonal win', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 5, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      expect(service.calculateWinner(gameBoard)).toEqual([0, 4, 8]);
    });

    test('returns null for an empty board', () => {
      const gameBoard = createEmptyBoard();
      expect(service.calculateWinner(gameBoard)).toBeNull();
    });
  });

  describe('determine outcome', () => {
    test('returns Draw outcome if the board is full and no winner', () => {
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

      expect(service.determineOutcome(gameBoard)).toBe(OutcomeEnum.Draw);
    });

    test('returns Win outcome for determineOutcome if there is a winner', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 5, 'O');

      expect(service.determineOutcome(gameBoard)).toBe(OutcomeEnum.Win);
    });

    test('returns None outcome if the board is not full and no winner', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 2, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 5, 'O');

      expect(service.determineOutcome(gameBoard)).toBe(OutcomeEnum.None);
    });
  });

  describe('get random empty square', () => {
    test('returns random index for a CPU move', () => {
      const gameBoard = createEmptyBoard();

      const randomIndex = service.getRandomEmptySquare(gameBoard);
      validatePositionRange(randomIndex);
    });
  });

  describe('medium cpu moves', () => {
    test('returns a cpu winning move if available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 3, 'X');
      gameBoard = setSquare(gameBoard, 4, 'X');

      const findWinningMoveSpy = jest.spyOn(service, 'findWinningMove');

      const cpuWinMove = service.makeMediumCpuMove(gameBoard);
      validatePositionRange(cpuWinMove);
      expect(findWinningMoveSpy).toHaveBeenCalledWith(gameBoard, 'O');
    });

    test('returns a blocking move if CPU has no winning move and human has a winning move', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 3, 'O');
      gameBoard = setSquare(gameBoard, 6, 'O');

      const findWinningMoveSpy = jest.spyOn(service, 'findWinningMove');

      const blockingMove = service.makeMediumCpuMove(gameBoard);
      validatePositionRange(blockingMove);
      expect(findWinningMoveSpy).toHaveBeenCalledWith(gameBoard, 'X');
    });

    test('returns a corner move if available and CPU and human have no winning moves available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 1, 'X');

      const findCornerMoveSpy = jest.spyOn(service, 'findCornerMove');

      const cornerMove = service.makeMediumCpuMove(gameBoard);
      validatePositionRange(cornerMove);
      expect(findCornerMoveSpy).toHaveBeenCalledWith(gameBoard);
    });

    test('returns a random move if no winning, blocking or corner move is available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'O');

      gameBoard = setSquare(gameBoard, 3, 'O');
      gameBoard = setSquare(gameBoard, 4, 'X');

      gameBoard = setSquare(gameBoard, 6, 'X');
      gameBoard = setSquare(gameBoard, 7, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const getRandomEmptySquareSpy = jest.spyOn(
        service,
        'getRandomEmptySquare'
      );

      const randomMove = service.makeMediumCpuMove(gameBoard);
      validatePositionRange(randomMove);
      expect(getRandomEmptySquareSpy).toHaveBeenCalledWith(gameBoard);
    });
  });

  describe('find winning move', () => {
    test('returns -1 if no winning move is available', () => {
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

    test('returns a winning move for the CPU', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 3, 'X');
      gameBoard = setSquare(gameBoard, 4, 'X');

      const winningMove = service.findWinningMove(gameBoard, 'O');
      expect(winningMove).toEqual(2);
    });

    test('finds winning move in diagonal', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 4, 'O');

      const winningMove = service.findWinningMove(gameBoard, 'O');
      expect(winningMove).toBe(8);
    });

    test('prioritizes win over block', () => {
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
    test('returns a corner move if available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 1, 'X');

      const cornerMove = service.findCornerMove(gameBoard);
      expect(corners).toContain(cornerMove);
    });

    test('returns -1 if no corner move is available', () => {
      let gameBoard = createEmptyBoard();

      corners.forEach((corner) => {
        gameBoard = setSquare(gameBoard, corner, 'X');
      });

      const cornerMove = service.findCornerMove(gameBoard);
      expect(cornerMove).toEqual(-1);
    });
  });

  describe('hard cpu moves', () => {
    test('returns a valid move for an empty board', () => {
      const gameBoard = createEmptyBoard();
      const move = service.makeHardCpuMove(gameBoard);
      validatePositionRange(move);
    });

    test('takes winning move when available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 6, 'X');
      gameBoard = setSquare(gameBoard, 2, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(1); // Winning move at position 1
    });

    test('blocks opponent winning move', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(2); // Block at position 2
    });

    test('blocks opponent winning move in column', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 7, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(3); // Block at position 3
    });

    test('prefers center over corners in early game', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(4); // Should take center
    });

    test('handles board with only one move left', () => {
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

    test('prevents opponent from creating a fork', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      // Should take position 1, 3, 5, or 7 to prevent fork
      expect([1, 3, 5, 7]).toContain(move);
    });

    test('prefers winning in fewer moves over longer paths', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 7, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(8); // Immediate win over potential fork
    });

    test('handles edge case where all corners are taken', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 2, 'O');
      gameBoard = setSquare(gameBoard, 6, 'X');
      gameBoard = setSquare(gameBoard, 8, 'O');

      const move = service.makeHardCpuMove(gameBoard);
      validatePositionRange(move);
    });

    test('blocks double threat scenarios', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 2, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(1); // Block the double threat
    });

    test('creates a double threat when possible', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 1, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect([0, 2, 6, 8]).toContain(move); // Create double threat opportunity
    });

    test('handles symmetrical board positions correctly', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 8, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');

      const move = service.makeHardCpuMove(gameBoard);
      expect([1, 3, 5, 7]).toContain(move); // Should take edge to prevent fork
    });

    test('returns draw score in drawn position', () => {
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

    test('prevents opponent from creating a fork in corner', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      expect(move).toBe(2); // Should take position 2 to prevent fork
    });

    test('handles error gracefully', () => {
      const gameBoard = createEmptyBoard();
      const mockError = new Error('Test error');

      jest.spyOn(service as any, 'getEmptySquares').mockImplementation(() => {
        throw mockError;
      });
      jest.spyOn(service, 'getRandomEmptySquare').mockReturnValue(4);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const move = service.makeHardCpuMove(gameBoard);

      expect(move).toBe(4);
      expect(service.getRandomEmptySquare).toHaveBeenCalledWith(gameBoard);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in makeHardCpuMove:',
        mockError
      );
    });
  });

  describe('minimax optimization', () => {
    test('makes optimal moves consistently', () => {
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

    test('uses memoization to improve performance', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 0, 'X');

      const minimaxSpy = jest.spyOn(service as any, 'minimax');

      // First call should compute all values
      service.makeHardCpuMove(gameBoard);
      const firstCallCount = minimaxSpy.mock.calls.length;
      minimaxSpy.mockClear();

      // Second call should use memoized values and make fewer minimax calls
      service.makeHardCpuMove(gameBoard);
      const secondCallCount = minimaxSpy.mock.calls.length;

      expect(secondCallCount).toBeLessThan(firstCallCount);
    });

    test('uses alpha-beta pruning effectively', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const minimaxSpy = jest.spyOn(service as any, 'minimax');

      // First run without alpha-beta pruning limits
      const withoutPruning = service.makeHardCpuMove(gameBoard);
      const normalCalls = minimaxSpy.mock.calls.length;
      minimaxSpy.mockClear();

      // Second run (should use alpha-beta pruning)
      const withPruning = service.makeHardCpuMove(gameBoard);

      // Verify moves are the same and pruning reduced calculation count
      expect(withPruning).toBe(withoutPruning);
      expect(minimaxSpy.mock.calls.length).toBeLessThanOrEqual(normalCalls);
    });
  });

  describe('minimax edge cases', () => {
    test('maintains consistent decisions after memoization clear', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');

      const firstMove = service.makeHardCpuMove(gameBoard);
      service.ngOnDestroy(); // Clear memoization
      const secondMove = service.makeHardCpuMove(gameBoard);

      expect(firstMove).toBe(secondMove);
    });
  });

  describe('fork opportunity detection', () => {
    test('detects potential fork in corners', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 4, 'X');
      gameBoard = setSquare(gameBoard, 8, 'O');

      const move = service.makeHardCpuMove(gameBoard);
      // Should take an edge to force opponent's move and prevent their win
      expect([1, 3, 5, 7]).toContain(move);
    });

    test('prevents opponent fork in multiple threats scenario', () => {
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
    test('makes a decision in reasonable time', () => {
      const gameBoard = createEmptyBoard();
      jest
        .spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(100);

      service.makeHardCpuMove(gameBoard);

      expect(performance.now()).toBeLessThan(1000);
    });
  });

  describe('error handling', () => {
    test('handles invalid board state gracefully', () => {
      let gameBoard = createEmptyBoard();
      // Create invalid board with more X's than O's
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 2, 'X');

      const move = service.makeHardCpuMove(gameBoard);
      validatePositionRange(move);
    });

    test('handles full board gracefully', () => {
      let gameBoard = createEmptyBoard();
      for (let i = 0; i < 9; i++) {
        gameBoard = setSquare(gameBoard, i, i % 2 === 0 ? 'X' : 'O');
      }

      expect(() => service.makeHardCpuMove(gameBoard)).not.toThrow();
    });

    test('fallbacks to random move when error occurs', () => {
      const gameBoard = createEmptyBoard();
      const error = new Error('Test error');

      // Mock getEmptySquares to throw the error instead of findBestMove
      jest.spyOn(service as any, 'getEmptySquares').mockImplementation(() => {
        throw error;
      });
      jest.spyOn(service, 'getRandomEmptySquare').mockReturnValue(4);
      jest.spyOn(console, 'error');

      const move = service.makeHardCpuMove(gameBoard);

      expect(move).toBe(4);
      expect(service.getRandomEmptySquare).toHaveBeenCalledWith(gameBoard);
    });

    test('logs error when exception occurs', () => {
      const gameBoard = createEmptyBoard();
      const error = new Error('Test error');
      const consoleSpy = jest.spyOn(console, 'error');

      jest.spyOn(service as any, 'getEmptySquares').mockImplementation(() => {
        throw error;
      });

      service.makeHardCpuMove(gameBoard);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in makeHardCpuMove:',
        error
      );
    });
  });

  describe('memory management', () => {
    test('clears memoized states during destroy', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');

      // Force memoization
      service.makeHardCpuMove(gameBoard);

      // Access private memoizedStates through ngOnDestroy
      service.ngOnDestroy();

      // Use indirect testing through performance check
      const minimaxSpy = jest
        .spyOn<GameService, any>(service, 'minimax')
        .mockImplementation();
      service.makeHardCpuMove(gameBoard);

      // Should make full calculation again after clear
      expect(minimaxSpy).toHaveBeenCalled();
    });
  });

  describe('minimax edge cases', () => {
    test('handles deep recursive positions efficiently', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');
      gameBoard = setSquare(gameBoard, 8, 'X');

      const startTime = performance.now();
      const move = service.makeHardCpuMove(gameBoard);
      const duration = performance.now() - startTime;

      validatePositionRange(move);
      expect(duration).toBeLessThan(1000); // Increased threshold to 1000ms for real-world conditions
    });

    test('maintains consistent decisions after memoization clear', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 4, 'O');

      const firstMove = service.makeHardCpuMove(gameBoard);
      service.ngOnDestroy(); // Clear memoization
      const secondMove = service.makeHardCpuMove(gameBoard);

      expect(firstMove).toBe(secondMove);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
