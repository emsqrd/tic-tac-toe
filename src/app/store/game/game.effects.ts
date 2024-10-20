import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, switchMap, of } from 'rxjs';
import { GameService } from '../../services/game.service';
import { makeMove, endGame, switchPlayer, attemptMove } from './game.actions';
import { GameState } from './game.reducer';
import { selectGameBoard, selectCurrentPlayer } from './game.selectors';
import { OutcomeEnum } from '../../enums/outcome.enum';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private gameService: GameService,
    private store: Store<{ game: GameState }>
  ) {}

  makeMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(makeMove),
      withLatestFrom(
        this.store.select(selectGameBoard),
        this.store.select(selectCurrentPlayer)
      ),
      switchMap(([action, gameBoard, currentPlayer]) => {
        const newBoard = gameBoard.map((square, index) =>
          index === action.position
            ? { ...square, gamePiece: currentPlayer.piece }
            : square
        );

        const winningPositions = this.gameService.calculateWinner(newBoard);

        if (winningPositions) {
          return of(endGame({ outcome: OutcomeEnum.Win, winningPositions }));
        } else if (newBoard.every((square) => square.gamePiece !== '')) {
          return of(
            endGame({ outcome: OutcomeEnum.Draw, winningPositions: null })
          );
        } else {
          return of(switchPlayer());
        }
      })
    )
  );

  attemptMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(attemptMove),
      withLatestFrom(this.store.select(selectGameBoard)),
      switchMap(([action, gameBoard]) => {
        // If the square is already taken, do nothing
        if (gameBoard[action.position].gamePiece !== '') {
          return of({ type: 'NO_OP' }); // return a no-op action
        }

        return of(makeMove({ position: action.position }));
      })
    )
  );
}
