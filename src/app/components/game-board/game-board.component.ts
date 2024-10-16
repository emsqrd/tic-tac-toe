import { Component, OnInit } from '@angular/core';
import { Player } from '../../models/player';
import { Square } from '../../models/square';
import { CommonModule } from '@angular/common';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { GameState } from '../../store/game/game.reducer';
import { makeMove, startGame } from '../../store/game/game.actions';
import {
  selectCurrentPlayer,
  selectGameBoard,
  selectIsDraw,
  selectWinner,
} from '../../store/game/game.selectors';

@Component({
  selector: 't3-game-board',
  standalone: true,
  imports: [CommonModule, SquareComponent, ScoringComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit {
  gameBoard$: Observable<Square[]>;
  currentPlayer$: Observable<Player>;
  winner$: Observable<Player | null>;
  isDraw$: Observable<boolean>;

  isDraw: boolean = false;
  gameOver: boolean = false;

  constructor(private store: Store<{ game: GameState }>) {
    this.gameBoard$ = store.select(selectGameBoard);
    this.currentPlayer$ = store.select(selectCurrentPlayer);
    this.winner$ = store.select(selectWinner);
    this.isDraw$ = store.select(selectIsDraw);
  }

  // Start the game when the component is initialized
  ngOnInit(): void {
    this.store.dispatch(startGame());

    // Subscribe to the winner changes
    this.winner$.subscribe((winner) => {
      this.gameOver = !!winner;
    });

    this.isDraw$.subscribe((isDraw) => {
      this.isDraw = this.gameOver = isDraw;
    });
  }

  // Clicking a square triggers a move
  // If the game is over, clicking a square should start a new game
  squareClick(position: number) {
    if (this.gameOver) {
      this.store.dispatch(startGame());
      this.gameOver = false;
    } else {
      this.store.dispatch(makeMove({ position }));
    }
  }
}
