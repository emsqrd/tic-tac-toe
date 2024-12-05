import { Injectable } from '@angular/core';
import { Square } from '../models/square';
import { OutcomeEnum } from '../enums/outcome.enum';
import { take, map } from 'rxjs';
import { selectGameBoard } from '../store/round/round.selectors';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly PLAYERS = {
    HUMAN: 'X',
    CPU: 'O',
    EMPTY: '',
  } as const;

  private readonly SCORES = {
    WIN: 1000, // Heavily weight winning
    DRAW: 0,
    POSITION: 10, // Small bonus for good positions
    DEPTH: 1, // Tiny bonus for winning sooner
  } as const;

  private readonly BOARD_SIZE = 9;
  private readonly memoizedStates = new Map<string, number>();

  private winConditions = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  constructor() {}

  // Calculate the winner and return the winning positions
  calculateWinner(gameBoard: Square[]): number[] | null {
    for (let i = 0; i < this.winConditions.length; i++) {
      const [a, b, c] = this.winConditions[i];
      if (
        gameBoard[a].gamePiece &&
        gameBoard[a].gamePiece === gameBoard[b].gamePiece &&
        gameBoard[a].gamePiece === gameBoard[c].gamePiece
      ) {
        return [a, b, c];
      }
    }
    return null;
  }

  determineOutcome(gameBoard: Square[]): OutcomeEnum {
    const winningPositions = this.calculateWinner(gameBoard);
    let outcome: OutcomeEnum = OutcomeEnum.None;

    if (winningPositions) {
      outcome = OutcomeEnum.Win;
    } else if (gameBoard.every((square) => square.gamePiece !== '')) {
      outcome = OutcomeEnum.Draw;
    }

    return outcome;
  }

  // Used for easy mode and general random moves
  getRandomEmptySquare(gameBoard: Square[]): number {
    const emptySquares: number[] = [];
    gameBoard.forEach((square, index) => {
      if (square.gamePiece === '') {
        emptySquares.push(index);
      }
    });

    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[randomIndex];
  }

  makeMediumCpuMove(gameBoard: Square[]): number {
    // Check if CPU can win
    const cpuWinMove = this.findWinningMove(gameBoard, 'O');
    if (cpuWinMove !== -1) {
      return cpuWinMove;
    }

    // Check if human can win and block
    const humanWinMove = this.findWinningMove(gameBoard, 'X');
    if (humanWinMove !== -1) {
      return humanWinMove;
    }

    // Take a corner if available
    const cornerMove = this.findCornerMove(gameBoard);
    if (cornerMove !== -1) {
      return cornerMove;
    }

    // If no winning moves, make a random move
    return this.getRandomEmptySquare(gameBoard);
  }

  makeHardCpuMove(gameBoard: Square[]): number {
    try {
      const emptyCells = this.getEmptySquares(gameBoard);

      // Take the center if available
      if (
        emptyCells.length === this.BOARD_SIZE ||
        (emptyCells.length === this.BOARD_SIZE - 1 &&
          gameBoard[4].gamePiece === this.PLAYERS.EMPTY)
      ) {
        return 4;
      }

      // Make winning move or block human winning move
      const immediateMove = this.findImmediateMoves(gameBoard);
      if (immediateMove !== -1) return immediateMove;

      return this.findBestMove(gameBoard);
    } catch (error) {
      console.error('Error in makeHardCpuMove:', error);
      return this.getRandomEmptySquare(gameBoard);
    }
  }

  private getEmptySquares(board: Square[]): number[] {
    return board.reduce<number[]>((squares, square, index) => {
      if (square.gamePiece === this.PLAYERS.EMPTY) squares.push(index);
      return squares;
    }, []);
  }

  // Check winning move first, then blocking move
  private findImmediateMoves(gameBoard: Square[]): number {
    const winningMove = this.findWinningMove(gameBoard, this.PLAYERS.CPU);
    if (winningMove !== -1) return winningMove;

    const blockingMove = this.findWinningMove(gameBoard, this.PLAYERS.HUMAN);
    if (blockingMove !== -1) return blockingMove;

    return -1;
  }

  private findBestMove(gameBoard: Square[]): number {
    let bestScore = -Infinity;
    let bestMove = -1;
    const emptySquares = this.getEmptySquares(gameBoard);
    const depth = emptySquares.length;

    for (const position of emptySquares) {
      const boardCopy = this.copyBoard(gameBoard);
      boardCopy[position].gamePiece = this.PLAYERS.CPU;

      const score = this.minimax(boardCopy, false, -Infinity, Infinity, depth);

      if (score > bestScore) {
        bestScore = score;
        bestMove = position;
      }
    }

    return bestMove;
  }

  private minimax(
    board: Square[],
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    depth: number
  ): number {
    const boardKey = this.getBoardKey(board);
    const memoizedScore = this.memoizedStates.get(boardKey);
    if (memoizedScore !== undefined) return memoizedScore;

    const winner = this.calculateWinner(board);
    if (winner) {
      return (
        (isMaximizing ? -1 : 1) * (this.SCORES.WIN + depth * this.SCORES.DEPTH)
      );
    }

    const emptySquares = this.getEmptySquares(board);
    if (emptySquares.length === 0) return this.SCORES.DRAW;

    const currentPlayer = isMaximizing ? this.PLAYERS.CPU : this.PLAYERS.HUMAN;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const position of emptySquares) {
      board[position].gamePiece = currentPlayer;

      // Calculate position value
      let positionValue = 0;
      if (position === 4) positionValue = this.SCORES.POSITION;
      else if ([0, 2, 6, 8].includes(position))
        positionValue = this.SCORES.POSITION / 2;

      const score =
        this.minimax(board, !isMaximizing, alpha, beta, depth - 1) +
        (isMaximizing ? positionValue : -positionValue);

      board[position].gamePiece = this.PLAYERS.EMPTY;

      bestScore = isMaximizing
        ? Math.max(bestScore, score)
        : Math.min(bestScore, score);

      if (isMaximizing) alpha = Math.max(alpha, score);
      else beta = Math.min(beta, score);

      if (beta <= alpha) break;
    }

    this.memoizedStates.set(boardKey, bestScore);
    return bestScore;
  }

  private getBoardKey(board: Square[]): string {
    return board.map((square) => square.gamePiece || '-').join('');
  }

  private clearMemoizedStates(): void {
    this.memoizedStates.clear();
  }

  // Add this to prevent memory leaks
  ngOnDestroy() {
    this.clearMemoizedStates();
  }

  private copyBoard(board: Square[]): Square[] {
    return board.map((square) => ({
      gamePiece: square.gamePiece,
      isWinner: square.isWinner,
    }));
  }

  findCornerMove(gameBoard: Square[]): number {
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(
      (corner) => gameBoard[corner].gamePiece === ''
    );

    if (emptyCorners.length > 0) {
      return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    return -1;
  }

  findWinningMove(gameBoard: Square[], gamePiece: string): number {
    for (const pattern of this.winConditions) {
      const [a, b, c] = pattern;
      const squares = [
        gameBoard[a].gamePiece,
        gameBoard[b].gamePiece,
        gameBoard[c].gamePiece,
      ];

      if (
        squares.filter((square) => square === gamePiece).length === 2 &&
        squares.filter((square) => square === '').length === 1
      ) {
        return pattern[squares.findIndex((square) => square === '')];
      }
    }

    return -1;
  }
}
