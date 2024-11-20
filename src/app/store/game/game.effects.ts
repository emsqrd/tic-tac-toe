import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, of, concatMap } from 'rxjs';
import { startGame } from './game.actions';
import { GameState } from './game.reducer';
import { selectGameMode } from './game.selectors';
import { setCpuPlayer } from '../player/player.actions';
import { PlayerState } from '../player/player.reducer';
import { selectPlayers } from '../player/player.selectors';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { RoundActions } from '../round/round.actions';
import { selectRoundStartingPlayerIndex } from '../round/round.selectors';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ game: GameState; player: PlayerState }>
  ) {}

  startGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startGame),
      withLatestFrom(
        this.store.select(selectGameMode),
        this.store.select(selectPlayers)
      ),
      concatMap(([_, gameMode, players]) => {
        // Create an array to hold actions so they can be chained together
        let actions = [];

        if (gameMode === GameModeEnum.SinglePlayer) {
          actions.push(setCpuPlayer({ gamePiece: players[1].piece }));
        }

        actions.push(RoundActions.startRound());

        return of(...actions);
      })
    )
  );
}
