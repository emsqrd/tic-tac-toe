import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Player } from '../../models/player';
import { GameState } from '../../store/game/game.reducer';
import { selectDraws, selectOutcome } from '../../store/game/game.selectors';
import { Observable } from 'rxjs';
import { OutcomeEnum } from '../../enums/outcome.enum';
import {
  selectCurrentPlayer,
  selectPlayers,
} from '../../store/player/player.selectors';

@Component({
  selector: 't3-scoring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoring.component.html',
  styleUrl: './scoring.component.scss',
})
export class ScoringComponent {
  players$: Observable<Player[]>;
  currentPlayer$: Observable<Player>;
  outcome$: Observable<OutcomeEnum>;
  draws$: Observable<number>;

  player1!: Player;
  player2!: Player;
  currentPlayer!: Player;
  draws!: number;
  outcome!: OutcomeEnum;

  get isResult() {
    return (
      this.outcome === OutcomeEnum.Win || this.outcome === OutcomeEnum.Draw
    );
  }

  get selectPlayer1() {
    return this.currentPlayer.name === this.player1.name || this.isResult;
  }

  get selectPlayer2() {
    return this.currentPlayer.name === this.player2.name || this.isResult;
  }

  get selectDraw() {
    return this.outcome === OutcomeEnum.Draw || this.isResult;
  }

  get isDraw() {
    return this.outcome === OutcomeEnum.Draw;
  }

  get player1Wins() {
    return (
      this.currentPlayer.name === this.player1.name &&
      this.outcome === OutcomeEnum.Win
    );
  }

  get player2Wins() {
    return (
      this.currentPlayer.name === this.player2.name &&
      this.outcome === OutcomeEnum.Win
    );
  }

  constructor(private store: Store<{ game: GameState }>) {
    this.players$ = store.select(selectPlayers);
    this.currentPlayer$ = store.select(selectCurrentPlayer);
    this.outcome$ = store.select(selectOutcome);
    this.draws$ = store.select(selectDraws);
  }

  ngOnInit() {
    this.players$.subscribe((players) => {
      this.player1 = players[0];
      this.player2 = players[1];
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
