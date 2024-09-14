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

  makeChoice(gridIndex: number) {
    let isNext = this.currentMove % 2 === 0;

    if (isNext) {
      this.squares[gridIndex] = 'O';
    } else {
      this.squares[gridIndex] = 'X';
    }

    this.currentMove++;
  }
}
