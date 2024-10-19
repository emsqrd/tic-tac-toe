import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Player } from '../../models/player';
import { GameState } from '../../store/game/game.reducer';
import {
  selectPlayer1,
  selectPlayer2,
  selectCurrentPlayer,
  selectDraws,
  selectOutcome,
} from '../../store/game/game.selectors';
import { Observable } from 'rxjs';
import { OutcomeEnum } from '../../enums/outcome.enum';

@Component({
  selector: 't3-scoring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoring.component.html',
  styleUrl: './scoring.component.scss',
})
export class ScoringComponent {
  player1$: Observable<Player>;
  player2$: Observable<Player>;
  currentPlayer$: Observable<Player>;
  outcome$: Observable<OutcomeEnum>;
  draws$: Observable<number>;

  player1!: Player;
  player2!: Player;
  currentPlayer!: Player;
  winner!: Player | null;
  draws!: number;
  isDraw: boolean = false;
  outcome!: OutcomeEnum;

  get isResult() {
    return this.outcome === OutcomeEnum.Win || OutcomeEnum.Draw;
  }

  get selectPlayer1() {
    return this.currentPlayer.name === this.player1.name || this.isResult;
  }

  get selectPlayer2() {
    return this.currentPlayer.name === this.player2.name || this.isResult;
  }

  get selectDraw() {
    return this.isDraw || this.isResult;
  }

  get player1Wins() {
    return this.winner === this.player1;
  }

  get player2Wins() {
    return this.winner === this.player2;
  }

  constructor(private store: Store<{ game: GameState }>) {
    this.player1$ = store.select(selectPlayer1);
    this.player2$ = store.select(selectPlayer2);
    this.currentPlayer$ = store.select(selectCurrentPlayer);
    this.outcome$ = store.select(selectOutcome);
    this.draws$ = store.select(selectDraws);
  }

  ngOnInit() {
    this.player1$.subscribe((player1) => {
      this.player1 = player1;
    });

    this.player2$.subscribe((player2) => {
      this.player2 = player2;
    });

    this.currentPlayer$.subscribe((currentPlayer) => {
      this.currentPlayer = currentPlayer;
    });

    this.outcome$.subscribe((outcome) => {
      this.outcome = outcome;
    });

    this.draws$.subscribe((draws) => {
      this.draws = draws;
    });
  }
}
