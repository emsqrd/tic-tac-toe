import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap, withLatestFrom } from 'rxjs';
import { selectCurrentPlayer } from './player.selectors';
import { Store } from '@ngrx/store';
import { GameState } from '../game/game.reducer';
import { PlayerState } from './player.reducer';
import { switchPlayer } from './player.actions';
import { RoundActions } from '../round/round.actions';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ game: GameState; player: PlayerState }>
  ) {}

  switchPlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(switchPlayer),
      withLatestFrom(this.store.select(selectCurrentPlayer)),
      switchMap(([_, currentPlayer]) => {
        console.log(`switching player: ${currentPlayer.name}`);
        if (currentPlayer.isCpu) {
          return of(RoundActions.makeCPUMove());
        } else {
          return of({ type: 'NO_OP' });
        }
      })
    )
  );
}
