import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, switchMap, of, tap, concatMap } from 'rxjs';
import { GameService } from '../../services/game.service';
import {
  makeMove,
  endGame,
  attemptMove,
  startGame,
  startRound,
} from './game.actions';
import { GameState } from './game.reducer';
import { selectGameBoard, selectGameMode } from './game.selectors';
import { OutcomeEnum } from '../../enums/outcome.enum';
import {
  setCpuPlayer,
  switchPlayer,
  updatePlayerWins,
} from '../player/player.actions';
import { PlayerState } from '../player/player.reducer';
import { selectCurrentPlayer, selectPlayers } from '../player/player.selectors';
import { GameModeEnum } from '../../enums/game-mode.enum';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private gameService: GameService,
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

        actions.push(startRound());

        return of(...actions);
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
      switchMap(([_, gameBoard]) => {
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
