import { Component, OnInit } from '@angular/core';
import { Player } from '../../models/player';
import { Square } from '../../models/square';
import { CommonModule } from '@angular/common';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameState } from '../../store/game/game.reducer';
import {
  attemptMove,
  makeMove,
  startGame,
  switchPlayer,
} from '../../store/game/game.actions';
import {
  selectCurrentPlayer,
  selectGameBoard,
  selectOutcome,
} from '../../store/game/game.selectors';
import { OutcomeEnum } from '../../enums/outcome.enum';

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
  outcome$: Observable<OutcomeEnum>;

  outcome!: OutcomeEnum;

  constructor(private store: Store<{ game: GameState }>) {
    this.gameBoard$ = store.select(selectGameBoard);
    this.currentPlayer$ = store.select(selectCurrentPlayer);
    this.outcome$ = store.select(selectOutcome);
  }

  get isDraw() {
    return this.outcome === OutcomeEnum.Draw;
  }

  // Start the game when the component is initialized
  ngOnInit(): void {
    this.outcome$.subscribe((outcome) => {
      this.outcome = outcome;
    });
  }

  // Clicking a square triggers a move
  // If the game is over, clicking a square should start a new game
  //  and switch the player
  squareClick(position: number) {
    if (this.outcome !== OutcomeEnum.None) {
      this.store.dispatch(startGame());
      this.store.dispatch(switchPlayer());
    } else {
      this.store.dispatch(attemptMove({ position }));
    }
  }
}
