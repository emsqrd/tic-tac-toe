import { Component, OnInit } from '@angular/core';
import { Player } from '../../models/player';
import { Square } from '../../models/square';
import { CommonModule } from '@angular/common';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 't3-game-board',
  standalone: true,
  imports: [CommonModule, SquareComponent, ScoringComponent, BoardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameBoardComponent {
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
  outcome = '';

  isDraw = false;

  // So far, this is only used in determining a draw. I'd like to have a better way of figuring that out.
  currentMove = 1;

  winningPlayer: Player | undefined;

  get currentPlayer(): Player {
    return this.player1.isCurrent ? this.player1 : this.player2;
  }

  private setCurrentPlayer() {
    this.player1.isCurrent = !this.player1.isCurrent;
    this.player2.isCurrent = !this.player2.isCurrent;
  }
}
