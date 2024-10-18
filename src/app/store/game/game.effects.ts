import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, switchMap, of } from 'rxjs';
import { GameService } from '../../services/game.service';
import { makeMove, endGame, switchPlayer } from './game.actions';
import { GameState } from './game.reducer';
import { selectGameBoard, selectCurrentPlayer } from './game.selectors';

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
          return of(endGame({ winner: currentPlayer, winningPositions }));
        } else if (newBoard.every((square) => square.gamePiece !== '')) {
          return of(endGame({ winner: null, winningPositions: null }));
        } else {
          return of(switchPlayer());
        }
      })
    )
  );

  endGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(endGame),
      switchMap(() => of(switchPlayer()))
    )
  );
}
