import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameState } from '../game/game.reducer';
import { PlayerState } from '../player/player.reducer';
import { Store } from '@ngrx/store';
import { withLatestFrom, switchMap, of } from 'rxjs';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { switchPlayer, updatePlayerWins } from '../player/player.actions';
import { selectCurrentPlayer } from '../player/player.selectors';
import { RoundActions } from './round.actions';
import { GameService } from '../../services/game.service';
import { updateDraws } from '../game/game.actions';
import { RoundState } from './round.reducer';
import { selectGameBoard } from './round.selectors';

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

  attemptMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.attemptMove),
      withLatestFrom(this.store.select(selectGameBoard)),
      switchMap(([action, gameBoard]) => {
        // If the square is already taken, do nothing
        if (gameBoard[action.position].gamePiece !== '') {
          return of({ type: 'NO_OP' }); // return a no-op action
        }

        return of(
          RoundActions.makeMove({
            position: action.position,
            currentPlayer: action.currentPlayer,
          })
        );
      })
    )
  );

  makeMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.makeMove),
      withLatestFrom(this.store.select(selectGameBoard)),
      switchMap(([_, gameBoard]) => {
        const winningPositions = this.gameService.calculateWinner(gameBoard);

        if (winningPositions) {
          return of(
            RoundActions.endRound({
              outcome: OutcomeEnum.Win,
              winningPositions,
            })
          );
        } else if (gameBoard.every((square) => square.gamePiece !== '')) {
          return of(
            RoundActions.endRound({
              outcome: OutcomeEnum.Draw,
              winningPositions: null,
            })
          );
        } else {
          return of(switchPlayer());
        }
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
