import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GameState } from '../game/game.reducer';
import { PlayerState } from '../player/player.reducer';
import { Store } from '@ngrx/store';
import { withLatestFrom, switchMap, of, delay, concat } from 'rxjs';
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
import { selectGameBoard } from './round.selectors';
import { selectGameDifficulty } from '../game/game.selectors';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';

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

  startRound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoundActions.startRound),
      switchMap((action) => {
        return of(
          setCurrentPlayer({ currentPlayerIndex: action.startingPlayerIndex })
        );
      })
    )
  );

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
        this.store.select(selectCurrentPlayer),
        this.store.select(selectGameDifficulty)
      ),
      switchMap(([_, gameBoard, currentPlayer, gameDifficulty]) => {
        let position!: number;
        switch (gameDifficulty) {
          case GameDifficultyEnum.Easy:
            position = this.gameService.getRandomEmptySquare(gameBoard);
            break;
          case GameDifficultyEnum.Medium:
            position = this.gameService.makeMediumCpuMove(gameBoard);
            break;
          case GameDifficultyEnum.Hard:
            position = this.gameService.makeHardCpuMove(gameBoard);
            break;
        }

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
      switchMap((action) => {
        let actions = [];

        if (action.outcome === OutcomeEnum.Win) {
          actions.push(updatePlayerWins());
        } else if (action.outcome === OutcomeEnum.Draw) {
          actions.push(updateDraws());
        }

        actions.push(RoundActions.switchRoundStartingPlayerIndex());

        return of(...actions);
      })
    )
  );
}
