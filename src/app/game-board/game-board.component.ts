import { Component } from '@angular/core';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent {
  gameBoardPieces = new Array(9);
  player1 = new Array(9);
  player2 = [];

  makeChoice(gridIndex: number) {
    console.log(gridIndex);
    this.gameBoardPieces[gridIndex] = 'X';
    this.player1[gridIndex] = gridIndex;
  }
}
