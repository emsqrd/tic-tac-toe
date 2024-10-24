import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, switchMap, of, tap } from 'rxjs';
import { GameService } from '../../services/game.service';
import { makeMove, endGame, attemptMove } from './game.actions';
import { GameState } from './game.reducer';
import { selectGameBoard } from './game.selectors';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { switchPlayer, updatePlayerWins } from '../player/player.actions';
import { PlayerState } from '../player/player.reducer';
import { selectCurrentPlayer } from '../player/player.selectors';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private gameService: GameService,
    private store: Store<{ game: GameState; player: PlayerState }>
  ) {}

  attemptMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(attemptMove),
      withLatestFrom(this.store.select(selectGameBoard)),
      switchMap(([action, gameBoard]) => {
        // If the square is already taken, do nothing
        if (gameBoard[action.position].gamePiece !== '') {
          return of({ type: 'NO_OP' }); // return a no-op action
        }

        return of(
          makeMove({
            position: action.position,
            currentPlayer: action.currentPlayer,
          })
        );
      })
    )
  );

  makeMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(makeMove),
      withLatestFrom(this.store.select(selectGameBoard)),
      switchMap(([action, gameBoard]) => {
        const winningPositions = this.gameService.calculateWinner(gameBoard);

        if (winningPositions) {
          return of(endGame({ outcome: OutcomeEnum.Win, winningPositions }));
        } else if (gameBoard.every((square) => square.gamePiece !== '')) {
          return of(
            endGame({ outcome: OutcomeEnum.Draw, winningPositions: null })
          );
        } else {
          return of(switchPlayer());
        }
      })
    )
  );

  endGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(endGame),
      withLatestFrom(this.store.select(selectCurrentPlayer)),
      switchMap(([action]) =>
        of(
          action.outcome === OutcomeEnum.Win
            ? updatePlayerWins()
            : { type: 'NO_OP' }
        )
      )
    )
  );
}
