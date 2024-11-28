import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, withLatestFrom } from 'rxjs';
import { startGame } from './game.actions';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { setCpuPlayer } from '../player/player.actions';
import { RoundActions } from '../round/round.actions';
import { selectPlayers } from '../player/player.selectors';

@Injectable()
export class GameEffects {
  constructor(private actions$: Actions, private store: Store) {}

  startGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startGame),
      withLatestFrom(this.store.select(selectPlayers)),
      mergeMap(([{ gameMode }, players]) => {
        const actions = [];

        if (gameMode === GameModeEnum.SinglePlayer) {
          actions.push(setCpuPlayer({ gamePiece: players[1].piece }));
        }

        actions.push(RoundActions.initializeRound());

        return actions;
      })
    )
  );
}
