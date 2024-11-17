import { TestBed } from '@angular/core/testing';
import { LineCalculatorService } from './line-calculator.service';
import { WinPattern } from '../enums/win-pattern.enum';
import { Square } from '../models/square';

describe('LineCalculatorService', () => {
  let service: LineCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineCalculatorService);
  });

  describe('calculateWinningPattern', () => {
    it('should return Row pattern for horizontal win', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[3] = { isWinner: true, gamePiece: 'X' };
      board[4] = { isWinner: true, gamePiece: 'X' };
      board[5] = { isWinner: true, gamePiece: 'X' };

      expect(service.calculateWinningPattern(board)).toBe(WinPattern.Row);
    });

    it('should return Column pattern for vertical win', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[1] = { isWinner: true, gamePiece: 'X' };
      board[4] = { isWinner: true, gamePiece: 'X' };
      board[7] = { isWinner: true, gamePiece: 'X' };

      expect(service.calculateWinningPattern(board)).toBe(WinPattern.Column);
    });

    it('should return Diagonal pattern for diagonal win', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[0] = { isWinner: true, gamePiece: 'X' };
      board[4] = { isWinner: true, gamePiece: 'X' };
      board[8] = { isWinner: true, gamePiece: 'X' };

      expect(service.calculateWinningPattern(board)).toBe(WinPattern.Diagonal);
    });

    it('should return AntiDiagonal pattern for anti-diagonal win', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[2] = { isWinner: true, gamePiece: 'X' };
      board[4] = { isWinner: true, gamePiece: 'X' };
      board[6] = { isWinner: true, gamePiece: 'X' };

      expect(service.calculateWinningPattern(board)).toBe(
        WinPattern.AntiDiagonal
      );
    });

    it('should return None when no winning pattern', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      expect(service.calculateWinningPattern(board)).toBe(WinPattern.None);
    });
  });

  describe('calculateLineStart', () => {
    it('should calculate correct start coordinates for Row pattern', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[3] = { isWinner: true, gamePiece: 'X' };
      const coords = service.calculateLineStart(board, WinPattern.Row);
      expect(coords).toEqual({ x: 0, y: 150 });
    });

    it('should calculate correct start coordinates for Column pattern', () => {
      const board: Square[] = Array(9).fill({ isWinner: false, gamePiece: '' });
      board[1] = { isWinner: true, gamePiece: 'X' };
      const coords = service.calculateLineStart(board, WinPattern.Column);
      expect(coords).toEqual({ x: 150, y: 0 });
    });

    it('should calculate correct start coordinates for Diagonal pattern', () => {
      const coords = service.calculateLineStart([], WinPattern.Diagonal);
      expect(coords).toEqual({ x: 0, y: 0 });
    });

    it('should calculate correct start coordinates for AntiDiagonal pattern', () => {
      const coords = service.calculateLineStart([], WinPattern.AntiDiagonal);
      expect(coords).toEqual({ x: 300, y: 0 });
    });
  });

  describe('calculateLineEnd', () => {
    it('should calculate correct end coordinates for Row pattern', () => {
      const start = { x: 0, y: 150 };
      const coords = service.calculateLineEnd(WinPattern.Row, start);
      expect(coords).toEqual({ x: 300, y: 150 });
    });

    it('should calculate correct end coordinates for Column pattern', () => {
      const start = { x: 150, y: 0 };
      const coords = service.calculateLineEnd(WinPattern.Column, start);
      expect(coords).toEqual({ x: 150, y: 300 });
    });

    it('should calculate correct end coordinates for Diagonal pattern', () => {
      const start = { x: 0, y: 0 };
      const coords = service.calculateLineEnd(WinPattern.Diagonal, start);
      expect(coords).toEqual({ x: 300, y: 300 });
    });

    it('should calculate correct end coordinates for AntiDiagonal pattern', () => {
      const start = { x: 300, y: 0 };
      const coords = service.calculateLineEnd(WinPattern.AntiDiagonal, start);
      expect(coords).toEqual({ x: 0, y: 300 });
    });
  });
});
