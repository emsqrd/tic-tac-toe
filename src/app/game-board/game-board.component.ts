import { Component } from '@angular/core';
import { Player } from '../models/player';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent {
  gameBoard = new Array(9);

  player1: Player = {
    name: 'Player 1',
    piece: 'X',
    wins: 0,
    isCurrent: true,
  };

  player2: Player = {
    name: 'Player 2',
    piece: 'O',
    wins: 0,
    isCurrent: false,
  };

  winningPlayer: Player | null = null;

  draws = 0;

  currentMove = 1;

  isResult: boolean = false;
  isDraw: boolean = false;

  public get gameOver() {
    return this.isResult || this.isDraw;
  }

  get currentPlayer(): Player {
    if (this.player1.isCurrent) {
      return this.player1;
    } else {
      return this.player2;
    }
  }

  squareClick(square: number) {
    if (!this.gameOver) {
      this.makeMove(square);
    } else {
      this.resetBoard();
    }
  }

  makeMove(square: number) {
    if (this.isResult || this.gameBoard[square]) {
      return;
    }

    this.gameBoard[square] = this.currentPlayer.piece;

    let winner = this.calculateWinner(this.gameBoard);

    if (winner) {
      this.isResult = true;
      this.setWinner(this.currentPlayer);
    } else if (this.currentMove === this.gameBoard.length) {
      this.isDraw = true;
      this.draws++;
    }

    if (this.player1.isCurrent) {
      this.player2.isCurrent = true;
      this.player1.isCurrent = false;
    } else {
      this.player1.isCurrent = true;
      this.player2.isCurrent = false;
    }

    this.currentMove++;
  }
  setWinner(currentPlayer: Player) {
    if (currentPlayer === this.player1) {
      this.player1.wins++;
    } else {
      this.player2.wins++;
    }
  }

  /// TODO: This breaks if we ever have more than two players
  setCurrentPlayer(): Player {
    if (this.player1.isCurrent) {
      return this.player1;
    } else {
      return this.player2;
    }
  }

  resetBoard() {
    this.gameBoard = new Array(9);
    this.currentMove = 1;
    this.isResult = false;
    this.isDraw = false;
  }

  calculateWinner(gameBoard: string[]) {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (
        gameBoard[a] &&
        gameBoard[a] === gameBoard[b] &&
        gameBoard[a] === gameBoard[c]
      ) {
        return gameBoard[a];
      }
    }
    return null;
  }
}
