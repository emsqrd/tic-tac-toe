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
  currentMove = 1;
  isResult: boolean = false;
  isDraw: boolean = false;
  winningPlayer: string | undefined;

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
    } else if (this.currentMove === this.squares.length) {
      this.isDraw = true;
    }

    console.log('hi');

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
