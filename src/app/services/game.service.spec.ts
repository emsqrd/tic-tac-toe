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
});
