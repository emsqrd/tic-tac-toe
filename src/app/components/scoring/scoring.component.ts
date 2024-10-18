import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Player } from '../../models/player';
import { GameState } from '../../store/game/game.reducer';
import {
  selectPlayer1,
  selectPlayer2,
  selectCurrentPlayer,
  selectWinner,
  selectDraws,
  selectIsDraw,
} from '../../store/game/game.selectors';
import { Observable } from 'rxjs';

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
  winner$: Observable<Player | null>;
  draws$: Observable<number>;
  isDraw$: Observable<boolean>;

  player1!: Player;
  player2!: Player;
  currentPlayer!: Player;
  winner!: Player | null;
  draws!: number;
  isDraw: boolean = false;

  get isResult() {
    return this.winner !== null || this.isDraw;
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
    this.winner$ = store.select(selectWinner);
    this.draws$ = store.select(selectDraws);
    this.isDraw$ = store.select(selectIsDraw);
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

    this.winner$.subscribe((winner) => {
      this.winner = winner;
    });

    this.draws$.subscribe((draws) => {
      this.draws = draws;
    });

    this.isDraw$.subscribe((isDraw) => {
      this.isDraw = isDraw;
    });
  }
}
