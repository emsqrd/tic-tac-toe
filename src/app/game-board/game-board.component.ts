import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player';
import { Square } from '../models/square';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit {
  gameBoard: Square[] = [];

  player1: Player = {
    name: 'Player 1',
    piece: 'X',
    wins: 0,
    isCurrent: true,
    isWinner: false,
  };

  player2: Player = {
    name: 'Player 2',
    piece: 'O',
    wins: 0,
    isCurrent: false,
    isWinner: false,
  };

  draws = 0;

  // So far, this is only used in determining a draw. I'd like to have a better way of figuring that out.
  currentMove = 1;

  isDraw: boolean = false;
  isWinner: boolean = false;
  winningPlayer: Player | undefined;

  ngOnInit(): void {
    this.buildGameBoard();
  }

  private buildGameBoard() {
    this.gameBoard = [];

    for (let i = 0; i < 9; i++) {
      let square: Square = {
        gamePiece: '',
        isWinner: false,
      };

      this.gameBoard.push(square);
    }
  }

  get currentPlayer(): Player {
    if (this.player1.isCurrent) {
      return this.player1;
    } else {
      return this.player2;
    }
  }

  get isGameOver(): boolean {
    return this.isDraw || this.isWinner;
  }

  squareClick(square: number, playerPiece: string) {
    if (!this.isGameOver) {
      this.makeMove(square, playerPiece);
    } else {
      this.resetBoard();
    }
  }

  makeMove(square: number, playerPiece: string) {
    if (this.gameBoard[square].gamePiece) {
      return;
    }

    this.gameBoard[square].gamePiece = playerPiece;

    this.determineResult();

    if (!this.isGameOver) {
      this.setCurrentPlayer();

      this.currentMove++;
    }
  }

  private setCurrentPlayer() {
    if (this.player1.isCurrent) {
      this.player2.isCurrent = true;
      this.player1.isCurrent = false;
    } else {
      this.player1.isCurrent = true;
      this.player2.isCurrent = false;
    }
  }

  private determineResult() {
    let winner = this.calculateWinner(this.gameBoard);
    // Is there a better way to determine a draw?
    this.isDraw = this.currentMove === this.gameBoard.length;

    if (winner) {
      this.isWinner = true;
      this.setWinner(this.currentPlayer);
    } else if (this.isDraw) {
      this.draws++;
    }
  }

  setWinner(currentPlayer: Player) {
    if (currentPlayer === this.player1) {
      this.player1.isWinner = true;
      this.player1.wins++;
    } else {
      this.player2.isWinner = true;
      this.player2.wins++;
    }
  }

  resetBoard() {
    this.buildGameBoard();
    this.currentMove = 1;
    this.isDraw = false;
    this.isWinner = false;
    this.player1.isWinner = false;
    this.player2.isWinner = false;
    this.setCurrentPlayer();
  }

  calculateWinner(gameBoard: Square[]) {
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
        gameBoard[a].gamePiece &&
        gameBoard[a].gamePiece === gameBoard[b].gamePiece &&
        gameBoard[a].gamePiece === gameBoard[c].gamePiece
      ) {
        gameBoard[a].isWinner = true;
        gameBoard[b].isWinner = true;
        gameBoard[c].isWinner = true;
        return gameBoard[a].gamePiece;
      }
    }
    return null;
  }
}
