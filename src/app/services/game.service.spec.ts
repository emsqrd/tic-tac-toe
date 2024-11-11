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

  it('should return random index for a CPU move', () => {
    const gameBoard: Square[] = Array(9).fill({
      gamePiece: '',
      isWinner: false,
    });

    const randomIndex = service.makeCpuMove(gameBoard);
    expect(randomIndex).toBeGreaterThanOrEqual(0);
    expect(randomIndex).toBeLessThanOrEqual(8);
  });
});
