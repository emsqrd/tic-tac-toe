import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, of, pipe, switchMap, withLatestFrom } from 'rxjs';
import { selectCurrentPlayer } from './player.selectors';
import { makeMove } from '../game/game.actions';
import { Store } from '@ngrx/store';
import { GameState } from '../game/game.reducer';
import { PlayerState } from './player.reducer';
import { switchPlayer } from './player.actions';
import { selectGameMode } from '../game/game.selectors';
import { GameModeEnum } from '../../enums/game-mode.enum';

@Injectable()
export class PlayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ game: GameState; player: PlayerState }>
  ) {}

  switchPlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(switchPlayer),
      withLatestFrom(
        this.store.select(selectCurrentPlayer),
        this.store.select(selectGameMode)
      ),
      switchMap(([_, currentPlayer, gameMode]) => {
        if (gameMode === GameModeEnum.SinglePlayer && currentPlayer.isCpu) {
          return of(makeMove({ currentPlayer: currentPlayer })).pipe(
            delay(500)
          );
        } else {
          return of({ type: 'NO_OP' });
        }
      })
    )
  );
}