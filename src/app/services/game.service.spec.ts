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

describe('GameService', () => {
  let service: GameService;

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
      expect(randomIndex).toBeGreaterThanOrEqual(0);
      expect(randomIndex).toBeLessThanOrEqual(8);
    });
  });

  describe('medium cpu moves', () => {
    it('should return a cpu winning move if available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'O');
      gameBoard = setSquare(gameBoard, 1, 'O');
      gameBoard = setSquare(gameBoard, 3, 'X');
      gameBoard = setSquare(gameBoard, 4, 'X');

      const cpuWinMove = service.makeMediumCpuMove(gameBoard);
      expect(cpuWinMove).toEqual(2);
    });

    it('should return a blocking move if human has a winning move', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');
      gameBoard = setSquare(gameBoard, 1, 'X');
      gameBoard = setSquare(gameBoard, 5, 'O');
      gameBoard = setSquare(gameBoard, 8, 'O');

      const blockingMove = service.makeMediumCpuMove(gameBoard);
      expect(blockingMove).toEqual(2);
    });

    it('should return a random move if no winning or blocking move is available', () => {
      let gameBoard = createEmptyBoard();
      gameBoard = setSquare(gameBoard, 0, 'X');

      spyOn(service, 'getRandomEmptySquare').and.callThrough();

      const randomMove = service.makeMediumCpuMove(gameBoard);
      expect(service.getRandomEmptySquare).toHaveBeenCalledWith(gameBoard);
      expect(randomMove).toBeGreaterThanOrEqual(0);
      expect(randomMove).toBeLessThanOrEqual(8);
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
});
