import { Component } from '@angular/core';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent {
  squares = new Array(9);
  player1 = new Array(9);
  player2 = new Array(9);

  player1Wins = 0;
  player2Wins = 0;
  draws = 0;
  currentMove = 1;
  isResult: boolean = false;
  isDraw: boolean = false;
  winningPlayer: string | undefined;

  public get gameOver() {
    return this.isResult || this.isDraw;
  }

  squareClick(square: number) {
    if (!this.gameOver) {
      this.makeMove(square);
    } else {
      this.resetBoard();
    }
  }

  makeMove(gridIndex: number) {
    if (this.isResult || this.squares[gridIndex]) {
      return;
    }

    let isNext = this.currentMove % 2 === 0;

    if (isNext) {
      this.squares[gridIndex] = 'O';
    } else {
      this.squares[gridIndex] = 'X';
    }

    let winner = this.calculateWinner(this.squares);

    if (winner) {
      this.isResult = true;
      this.winningPlayer = this.squares[gridIndex];

      if (this.winningPlayer === 'X') {
        this.player1Wins++;
      } else {
        this.player2Wins++;
      }
    } else if (this.currentMove === this.squares.length) {
      this.isDraw = true;
      this.draws++;
    }

    this.currentMove++;
  }

  resetBoard() {
    this.squares = new Array(9);
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
