import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameState } from '../game/game.reducer';
import { PlayerState } from '../player/player.reducer';
import { Store } from '@ngrx/store';
import { withLatestFrom, switchMap, of, delay, concat } from 'rxjs';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { switchPlayer, updatePlayerWins } from '../player/player.actions';
import { selectCurrentPlayer } from '../player/player.selectors';
import { RoundActions } from './round.actions';
import { GameService } from '../../services/game.service';
import { updateDraws } from '../game/game.actions';
import { RoundState } from './round.reducer';
import { selectGameBoard } from './round.selectors';
import { selectGameDifficulty } from '../game/game.selectors';

@Injectable()
export class RoundEffects {
  constructor(
    private actions$: Actions,
    private gameService: GameService,
    private store: Store<{
      game: GameState;
      round: RoundState;
      player: PlayerState;
    }>
  ) {}

  private applyDelay<T>(duration: number) {
    return delay<T>(duration);
  }

  makeHumanMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.makeHumanMove),
      withLatestFrom(this.store.select(selectCurrentPlayer)),
      switchMap(([action, currentPlayer]) => {
        return concat(
          of(RoundActions.setProcessingMove({ processingMove: true })),
          of(
            RoundActions.setBoardPosition({
              position: action.position,
              piece: currentPlayer.piece,
            })
          )
        );
      })
    )
  );

  makeCpuMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.makeCPUMove),
      withLatestFrom(
        this.store.select(selectGameBoard),
        this.store.select(selectCurrentPlayer)
      ),
      switchMap(([_, gameBoard, currentPlayer]) => {
        const position = this.gameService.makeCpuMove(gameBoard);

        return concat(
          of(RoundActions.setProcessingMove({ processingMove: true })),
          of(
            RoundActions.setBoardPosition({
              position,
              piece: currentPlayer.piece,
            })
          ).pipe(this.applyDelay(500))
        );
      })
    )
  );

  setBoardPosition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.setBoardPosition),
      withLatestFrom(this.store.select(selectGameBoard)),
      switchMap(([_, gameBoard]) => {
        let actions = [];

        const winningPositions = this.gameService.calculateWinner(gameBoard);
        const outcome = this.gameService.determineOutcome(gameBoard);

        if (outcome !== OutcomeEnum.None) {
          actions.push(RoundActions.endRound({ outcome, winningPositions }));
        } else {
          actions.push(switchPlayer());
        }

        actions.push(RoundActions.setProcessingMove({ processingMove: false }));

        return of(...actions);
      })
    )
  );

  endRound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.endRound),
      withLatestFrom(this.store.select(selectCurrentPlayer)),
      switchMap(([action]) => {
        if (action.outcome === OutcomeEnum.Win) {
          return of(updatePlayerWins());
        } else if (action.outcome === OutcomeEnum.Draw) {
          return of(updateDraws());
        } else {
          return of({ type: 'NO_OP' });
        }
      })
    )
  );
}
