import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { Square } from '../models/square';
import { OutcomeEnum } from '../enums/outcome.enum';

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
      const gameBoard: Square[] = [
        { gamePiece: 'X', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
      ];
      expect(service.calculateWinner(gameBoard)).toBeNull();
    });

    it('should return winning positions for a row win', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
      ];
      expect(service.calculateWinner(gameBoard)).toEqual([0, 1, 2]);
    });

    it('should return winning positions for a column win', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
      ];
      expect(service.calculateWinner(gameBoard)).toEqual([0, 3, 6]);
    });

    it('should return winning positions for a diagonal win', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: 'X', isWinner: false },
      ];
      expect(service.calculateWinner(gameBoard)).toEqual([0, 4, 8]);
    });

    it('should return null for an empty board', () => {
      const gameBoard: Square[] = Array(9).fill({
        gamePiece: '',
        isWinner: false,
      });
      expect(service.calculateWinner(gameBoard)).toBeNull();
    });
  });

  describe('determine outcome', () => {
    it('should return Draw outcome if the board is full and no winner', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'O', isWinner: false },
      ];
      expect(service.determineOutcome(gameBoard)).toEqual(OutcomeEnum.Draw);
    });

    it('should return Win outcome for determineOutcome if there is a winner', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
      ];
      expect(service.determineOutcome(gameBoard)).toEqual(OutcomeEnum.Win);
    });

    it('should return None outcome if the board is not full and no winner', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
      ];
      expect(service.determineOutcome(gameBoard)).toEqual(OutcomeEnum.None);
    });
  });

  describe('get random empty square', () => {
    it('should return random index for a CPU move', () => {
      const gameBoard: Square[] = Array(9).fill({
        gamePiece: '',
        isWinner: false,
      });

      const randomIndex = service.getRandomEmptySquare(gameBoard);
      expect(randomIndex).toBeGreaterThanOrEqual(0);
      expect(randomIndex).toBeLessThanOrEqual(8);
    });
  });

  describe('medium cpu moves', () => {
    it('should return a cpu winning move if available', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
      ];

      const cpuWinMove = service.makeMediumCpuMove(gameBoard);
      expect(cpuWinMove).toEqual(2);
    });

    it('should return a blocking move if human has a winning move', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: 'O', isWinner: false },
      ];

      const blockingMove = service.makeMediumCpuMove(gameBoard);
      expect(blockingMove).toEqual(2);
    });

    it('should return a random move if no winning or blocking move is available', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'X', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: '', isWinner: false },
      ];

      spyOn(service, 'getRandomEmptySquare').and.callThrough();

      const randomMove = service.makeMediumCpuMove(gameBoard);
      expect(service.getRandomEmptySquare).toHaveBeenCalledWith(gameBoard);
      expect(randomMove).toBeGreaterThanOrEqual(0);
      expect(randomMove).toBeLessThanOrEqual(8);
    });
  });

  describe('find winning move', () => {
    it('should return -1 if no winning move is available', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'X', isWinner: false },
      ];

      const winningMove = service.findWinningMove(gameBoard, 'O');
      expect(winningMove).toEqual(-1);
    });

    it('should return a winning move for the CPU', () => {
      const gameBoard: Square[] = [
        { gamePiece: 'O', isWinner: false },
        { gamePiece: 'O', isWinner: false },
        { gamePiece: '', isWinner: false },
        { gamePiece: 'X', isWinner: false },
        { gamePiece: 'X', isWinner: false },
      ];

      const winningMove = service.findWinningMove(gameBoard, 'O');
      expect(winningMove).toEqual(2);
    });
  });
});
