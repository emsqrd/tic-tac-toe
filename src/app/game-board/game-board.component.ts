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
  ///TODO: I think I'm on to something here, but need to work through the logic
  /// The idea is that I have a currentPlayer object that I can do my manipulating with
  /// but the individual player1 and player2 also get updated when needed

  gameBoard = new Array(9);

  player1: Player = {
    name: 'Player 1',
    piece: 'X',
    wins: 0,
    isNext: true,
  };

  player2: Player = {
    name: 'Player 2',
    piece: 'O',
    wins: 0,
    isNext: false,
  };

  draws = 0;

  currentMove = 1;

  isResult: boolean = false;
  isDraw: boolean = false;
  winningPlayer: Player | null = null;

  public get gameOver() {
    return this.isResult || this.isDraw;
  }

  get currentPlayer(): Player {
    if (this.player1.isNext) {
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

    // let isNext = this.currentMove % 2 === 0;

    // if (isNext) {
    //   this.squares[square] = 'O';
    // } else {
    //   this.squares[square] = 'X';
    // }

    this.gameBoard[square] = this.currentPlayer.piece;

    let winner = this.calculateWinner(this.gameBoard);

    if (winner) {
      this.isResult = true;

      this.setWinner(this.currentPlayer);

      // this.winningPlayer = this.gameBoard[square];

      // if (this.winningPlayer === 'X') {
      //   this.player1Wins++;
      // } else {
      //   this.player2Wins++;
      // }
    } else if (this.currentMove === this.gameBoard.length) {
      this.isDraw = true;
      this.draws++;
    }

    this.currentPlayer.isNext = this.currentMove % 2 === 0;
  }
  setWinner(currentPlayer: Player) {
    if ((currentPlayer = this.player1)) {
      this.player1.wins++;
    } else {
      this.player2.wins++;
    }
  }

  /// TODO: This breaks if we ever have more than two players
  setCurrentPlayer(): Player {
    if (this.player1.isNext) {
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

  calculateWinner(squares: string[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }
}
