import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameState } from '../game/game.reducer';
import { PlayerState } from '../player/player.reducer';
import { Action, Store } from '@ngrx/store';
import {
  withLatestFrom,
  switchMap,
  of,
  delay,
  concat,
  map,
  catchError,
  mergeMap,
  EMPTY,
  take,
} from 'rxjs';
import { OutcomeEnum } from '../../enums/outcome.enum';
import {
  setCurrentPlayer,
  switchPlayer,
  updatePlayerWins,
} from '../player/player.actions';
import { selectCurrentPlayer } from '../player/player.selectors';
import { RoundActions } from './round.actions';
import { GameService } from '../../services/game.service';
import { updateDraws } from '../game/game.actions';
import { RoundState } from './round.reducer';
import {
  selectGameBoard,
  selectRoundStartingPlayerIndex,
} from './round.selectors';
import { selectGameDifficulty, selectGameMode } from '../game/game.selectors';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { Square } from '../../models/square';

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

  initializeRound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.initializeRound),
      withLatestFrom(
        this.store.select(selectRoundStartingPlayerIndex),
        this.store.select(selectGameMode),
        this.store.select(selectGameBoard)
      ),
      mergeMap(([_, startingPlayerIndex, gameMode, boardState]) => {
        const actions: Action[] = [
          RoundActions.setProcessingState({ isProcessing: false }),
          RoundActions.updateBoard({ clear: true }),
          setCurrentPlayer({ currentPlayerIndex: startingPlayerIndex }),
        ];

        if (
          gameMode === GameModeEnum.SinglePlayer &&
          startingPlayerIndex === 1
        ) {
          actions.push(RoundActions.processCPUMove({ boardState }));
        }

        return actions;
      })
    )
  );

  completeRound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.completeRound),
      mergeMap(({ outcome }) => {
        const actions = [];

        if (outcome === OutcomeEnum.Win) {
          actions.push(updatePlayerWins());
        } else if (outcome === OutcomeEnum.Draw) {
          actions.push(updateDraws());
        }

        // Always switch starting player for next round
        actions.push(RoundActions.switchRoundStartingPlayerIndex());

        return actions;
      })
    )
  );

  processCPUMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.processCPUMove),
      withLatestFrom(
        this.store.select(selectGameDifficulty),
        this.store.select(selectCurrentPlayer)
      ),
      this.applyDelay(750),
      mergeMap(([{ boardState }, difficulty, player]) => {
        const position = this.calculateCPUMove(boardState, difficulty);
        return [
          RoundActions.setProcessingState({ isProcessing: true }),
          RoundActions.updateBoard({ position, piece: player.piece }),
          RoundActions.evaluateRoundStatus({
            boardState: boardState.map((square, index) =>
              index === position
                ? { ...square, gamePiece: player.piece }
                : square
            ),
          }),
          RoundActions.setProcessingState({ isProcessing: false }),
        ];
      })
    )
  );

  processHumanMove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.processHumanMove),
      switchMap(({ position, piece }) =>
        concat(
          [
            RoundActions.setProcessingState({ isProcessing: true }),
            RoundActions.updateBoard({ position, piece }),
          ],
          this.store.select(selectGameBoard).pipe(
            take(1),
            map((boardState) => [
              RoundActions.evaluateRoundStatus({ boardState }),
              RoundActions.setProcessingState({ isProcessing: false }),
            ])
          )
        )
      ),
      mergeMap((actions) => (Array.isArray(actions) ? actions : [actions]))
    )
  );

  evaluateRoundStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.evaluateRoundStatus),
      withLatestFrom(
        this.store.select(selectGameMode),
        this.store.select(selectCurrentPlayer),
        this.store.select(selectGameBoard)
      ),
      mergeMap(([_, gameMode, currentPlayer, boardState]) => {
        const outcome = this.gameService.determineOutcome(boardState);
        const winningPositions =
          this.gameService.calculateWinner(boardState) ?? undefined;

        if (outcome !== OutcomeEnum.None) {
          return of(RoundActions.completeRound({ outcome, winningPositions }));
        } else {
          return of(switchPlayer());
        }
      })
    )
  );

  private calculateCPUMove(
    boardState: Square[],
    difficulty: GameDifficultyEnum
  ): number {
    switch (difficulty) {
      case GameDifficultyEnum.Hard:
        return this.gameService.makeHardCpuMove(boardState);
      case GameDifficultyEnum.Medium:
        return this.gameService.makeMediumCpuMove(boardState);
      default:
        return this.gameService.getRandomEmptySquare(boardState);
    }
  }
}
