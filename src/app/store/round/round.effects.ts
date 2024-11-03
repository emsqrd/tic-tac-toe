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
      withLatestFrom(
        this.store.select(selectGameBoard),
        this.store.select(selectCurrentPlayer)
      ),
      switchMap(([action, gameBoard, currentPlayer]) => {
        const position = action.position;
        // If the square is already taken, do nothing
        if (position !== undefined && gameBoard[position].gamePiece !== '') {
          return of({ type: 'NO_OP' }); // return a no-op action
        }

        const moveDelay = currentPlayer.isCpu ? 500 : 0;

        return concat(
          of(RoundActions.setProcessingMove({ processingMove: true })),
          of(
            RoundActions.makeMove({
              position: action.position,
              currentPlayer: currentPlayer,
            })
          ).pipe(delay(moveDelay))
        );
      })
    )
  );

  makeMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.makeMove),
      withLatestFrom(this.store.select(selectGameBoard)),
      switchMap(([_, gameBoard]) => {
        let actions = [];

        const winningPositions = this.gameService.calculateWinner(gameBoard);

        if (winningPositions) {
          actions.push(
            RoundActions.endRound({
              outcome: OutcomeEnum.Win,
              winningPositions,
            })
          );
        } else if (gameBoard.every((square) => square.gamePiece !== '')) {
          actions.push(
            RoundActions.endRound({
              outcome: OutcomeEnum.Draw,
              winningPositions: null,
            })
          );
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
