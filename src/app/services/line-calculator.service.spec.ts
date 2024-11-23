import { LineCalculatorService } from './line-calculator.service';
import { WinPattern } from '../enums/win-pattern.enum';
import { Square } from '../models/square';

describe('LineCalculatorService', () => {
  let service: LineCalculatorService;

  beforeEach(() => {
    service = new LineCalculatorService();
  });

  describe('calculateWinningPattern', () => {
    test('returns Row pattern when there is a horizontal win', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[3] = { isWinner: true, gamePiece: 'X' };
      board[4] = { isWinner: true, gamePiece: 'X' };
      board[5] = { isWinner: true, gamePiece: 'X' };

      expect(service.calculateWinningPattern(board)).toBe(WinPattern.Row);
    });

    test('returns Column pattern when there is a vertical win', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[1] = { isWinner: true, gamePiece: 'X' };
      board[4] = { isWinner: true, gamePiece: 'X' };
      board[7] = { isWinner: true, gamePiece: 'X' };

      expect(service.calculateWinningPattern(board)).toBe(WinPattern.Column);
    });

    test('returns Diagonal pattern when there is a diagonal win', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[0] = { isWinner: true, gamePiece: 'X' };
      board[4] = { isWinner: true, gamePiece: 'X' };
      board[8] = { isWinner: true, gamePiece: 'X' };

      expect(service.calculateWinningPattern(board)).toBe(WinPattern.Diagonal);
    });

    test('returns AntiDiagonal pattern when there is an anti-diagonal win', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[2] = { isWinner: true, gamePiece: 'X' };
      board[4] = { isWinner: true, gamePiece: 'X' };
      board[6] = { isWinner: true, gamePiece: 'X' };

      expect(service.calculateWinningPattern(board)).toBe(
        WinPattern.AntiDiagonal
      );
    });

    test('returns None when there is no winning pattern', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      expect(service.calculateWinningPattern(board)).toBe(WinPattern.None);
    });
  });

  describe('calculateLineStart', () => {
    test('calculates correct start coordinates for Row pattern', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[3] = { isWinner: true, gamePiece: 'X' };

      expect(service.calculateLineStart(board, WinPattern.Row)).toEqual({
        x: 0,
        y: 150,
      });
    });

    test('calculates correct start coordinates for Column pattern', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[1] = { isWinner: true, gamePiece: 'X' };

      expect(service.calculateLineStart(board, WinPattern.Column)).toEqual({
        x: 150,
        y: 0,
      });
    });

    test('calculates correct start coordinates for Diagonal pattern', () => {
      expect(service.calculateLineStart([], WinPattern.Diagonal)).toEqual({
        x: 0,
        y: 0,
      });
    });

    test('calculates correct start coordinates for AntiDiagonal pattern', () => {
      expect(service.calculateLineStart([], WinPattern.AntiDiagonal)).toEqual({
        x: 300,
        y: 0,
      });
    });
  });

  describe('calculateLineEnd', () => {
    test('calculates correct end coordinates for Row pattern', () => {
      const start = { x: 0, y: 150 };
      expect(service.calculateLineEnd(WinPattern.Row, start)).toEqual({
        x: 300,
        y: 150,
      });
    });

    test('calculates correct end coordinates for Column pattern', () => {
      const start = { x: 150, y: 0 };
      expect(service.calculateLineEnd(WinPattern.Column, start)).toEqual({
        x: 150,
        y: 300,
      });
    });

    test('calculates correct end coordinates for Diagonal pattern', () => {
      const start = { x: 0, y: 0 };
      expect(service.calculateLineEnd(WinPattern.Diagonal, start)).toEqual({
        x: 300,
        y: 300,
      });
    });

    test('calculates correct end coordinates for AntiDiagonal pattern', () => {
      const start = { x: 300, y: 0 };
      expect(service.calculateLineEnd(WinPattern.AntiDiagonal, start)).toEqual({
        x: 0,
        y: 300,
      });
    });
  });
});
