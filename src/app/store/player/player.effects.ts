import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, mergeMap, of, withLatestFrom } from 'rxjs';
import { GameState } from '../game/game.reducer';
import { PlayerState } from './player.reducer';
import { switchPlayer } from './player.actions';
import { selectGameMode } from '../game/game.selectors';
import { selectCurrentPlayer } from './player.selectors';
import { selectGameBoard } from '../round/round.selectors';
import { RoundActions } from '../round/round.actions';
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
        this.store.select(selectGameMode),
        this.store.select(selectCurrentPlayer),
        this.store.select(selectGameBoard)
      ),
      mergeMap(([_, gameMode, currentPlayer, boardState]) => {
        // Process CPU Move if we've swtiched to a CPU player
        if (gameMode === GameModeEnum.SinglePlayer && currentPlayer.isCpu) {
          return of(RoundActions.processCPUMove({ boardState }));
        } else {
          return EMPTY;
        }
      })
    )
  );
}
