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

  gameOver: boolean = false;
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
    this.store.dispatch(startGame());

    this.outcome$.subscribe((outcome) => {
      this.outcome = outcome;
    });
  }

  // Clicking a square triggers a move
  // If the game is over, clicking a square should start a new game
  squareClick(position: number) {
    if (this.outcome === OutcomeEnum.Win || this.outcome === OutcomeEnum.Draw) {
      this.store.dispatch(startGame());
    } else {
      this.store.dispatch(makeMove({ position }));
    }
  }
}
