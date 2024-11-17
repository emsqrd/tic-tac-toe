import { Injectable } from '@angular/core';
import { Square } from '../models/square';
import { WinPattern } from '../enums/win-pattern.enum';
import { Coordinates } from '../models/coordinates.model';

@Injectable({
  providedIn: 'root',
})
export class LineCalculatorService {
  private readonly BOARD_SIZE = 300;
  private readonly SQUARE_SIZE = 100;
  private readonly OFFSET = 50;

  calculateWinningPattern(gameBoard: Square[]): WinPattern {
    const winningSquares = gameBoard
      .map((square, index) => ({ ...square, index }))
      .filter((square) => square.isWinner);

    let winPattern: WinPattern = WinPattern.None;

    if (winningSquares.length === 0) winPattern = WinPattern.None;

    const indices = winningSquares
      .map((square) => square.index)
      .sort((a, b) => a - b);

    if (Math.floor(indices[0] / 3) === Math.floor(indices[1] / 3))
      winPattern = WinPattern.Row;
    if (indices[0] % 3 === indices[1] % 3) winPattern = WinPattern.Column;
    if (indices.includes(4)) {
      if (indices.includes(0)) winPattern = WinPattern.Diagonal;
      if (indices.includes(2)) winPattern = WinPattern.AntiDiagonal;
    }
    return winPattern;
  }

  calculateLineStart(board: Square[], pattern: WinPattern): Coordinates {
    const winnerIndex = board.findIndex((s) => s.isWinner);
    const row = Math.floor(winnerIndex / 3);
    const col = winnerIndex % 3;

    const coordinates: Record<WinPattern, Coordinates> = {
      [WinPattern.Row]: { x: 0, y: this.OFFSET + row * this.SQUARE_SIZE },
      [WinPattern.Column]: { x: this.OFFSET + col * this.SQUARE_SIZE, y: 0 },
      [WinPattern.Diagonal]: { x: 0, y: 0 },
      [WinPattern.AntiDiagonal]: { x: this.BOARD_SIZE, y: 0 },
      [WinPattern.None]: { x: 0, y: 0 },
    };

    return coordinates[pattern];
  }

  calculateLineEnd(pattern: WinPattern, start: Coordinates): Coordinates {
    const coordinates: Record<WinPattern, Coordinates> = {
      [WinPattern.Row]: { x: this.BOARD_SIZE, y: start.y },
      [WinPattern.Column]: { x: start.x, y: this.BOARD_SIZE },
      [WinPattern.Diagonal]: { x: this.BOARD_SIZE, y: this.BOARD_SIZE },
      [WinPattern.AntiDiagonal]: { x: 0, y: this.BOARD_SIZE },
      [WinPattern.None]: { x: 0, y: 0 },
    };

    return coordinates[pattern];
  }
}
