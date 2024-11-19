import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import { Observable } from 'rxjs';
import { Store, STORE_FEATURES } from '@ngrx/store';
import {
  switchGameMode,
  startGame,
  resetDraws,
  switchGameDifficulty,
} from '../../store/game/game.actions';
import {
  selectGameDifficulty,
  selectGameMode,
} from '../../store/game/game.selectors';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { resetPlayers, switchPlayer } from '../../store/player/player.actions';
import { selectCurrentPlayer } from '../../store/player/player.selectors';
import { GameModeEnum } from '../../enums/game-mode.enum';
import {
  selectGameBoard,
  selectOutcome,
  selectProcessingMove,
  selectRoundStartingPlayerIndex,
} from '../../store/round/round.selectors';
import { RoundActions } from '../../store/round/round.actions';
import { map, withLatestFrom, take } from 'rxjs/operators';
import { LineCalculatorService } from '../../services/line-calculator.service';

@Component({
  selector: 't3-game-board',
  standalone: true,
  imports: [CommonModule, SquareComponent, ScoringComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly lineCalculator = inject(LineCalculatorService);

  readonly gameBoard$ = this.store.select(selectGameBoard);
  readonly outcome$ = this.store.select(selectOutcome);
  readonly currentPlayer$ = this.store.select(selectCurrentPlayer);
  readonly gameMode$ = this.store.select(selectGameMode);
  readonly processingMove$ = this.store.select(selectProcessingMove);
  readonly gameDifficulty$ = this.store.select(selectGameDifficulty);
  readonly roundStartingPlayerIndex$ = this.store.select(
    selectRoundStartingPlayerIndex
  );

  readonly isDraw$ = this.outcome$.pipe(
    map((outcome) => outcome === OutcomeEnum.Draw)
  );

  readonly hasWinner$ = this.gameBoard$.pipe(
    map((board) => board?.some((square) => square.isWinner) || false)
  );

  readonly winningPattern$ = this.gameBoard$.pipe(
    map((board) => this.lineCalculator.calculateWinningPattern(board))
  );

  readonly lineStart$ = this.gameBoard$.pipe(
    withLatestFrom(this.winningPattern$),
    map(([board, pattern]) =>
      this.lineCalculator.calculateLineStart(board, pattern)
    )
  );

  readonly lineEnd$ = this.gameBoard$.pipe(
    withLatestFrom(this.winningPattern$, this.lineStart$),
    map(([board, pattern, start]) =>
      this.lineCalculator.calculateLineEnd(pattern, start)
    )
  );

  readonly gameModeButtonText$ = this.gameMode$.pipe(
    map((mode) => mode.valueOf())
  );

  readonly gameDifficultyButtonText$ = this.gameDifficulty$.pipe(
    map((difficulty) => difficulty.valueOf())
  );

  readonly showDifficultyButton$ = this.gameMode$.pipe(
    map((mode) => mode === GameModeEnum.SinglePlayer)
  );

  readonly showComingSoon$ = new Observable<boolean>((subscriber) =>
    subscriber.next(false)
  );

  constructor() {}

  ngOnInit(): void {
    this.store.dispatch(startGame({ gameMode: GameModeEnum.TwoPlayer }));
  }

  // Clicking a square triggers a move
  // If the game is over, clicking a square should start a new game
  //  and switch the player
  squareClick(position: number) {
    this.outcome$
      .pipe(withLatestFrom(this.roundStartingPlayerIndex$), take(1))
      .subscribe(([outcome, roundStartingPlayerIndex]) => {
        if (outcome !== OutcomeEnum.None) {
          this.store.dispatch(
            RoundActions.startRound({
              startingPlayerIndex: roundStartingPlayerIndex,
            })
          );
          // this.store.dispatch(switchPlayer());
        } else {
          this.attemptMove(position);
        }
      });
  }

  attemptMove(position: number) {
    this.gameBoard$.pipe(take(1)).subscribe((gameBoard) => {
      if (gameBoard[position].gamePiece !== '') {
        return;
      }
      this.store.dispatch(RoundActions.makeHumanMove({ position }));
    });
  }

  gameModeClick() {
    this.store.dispatch(switchGameMode());
    this.startNewGame();
  }

  gameDifficultyClick() {
    this.store.dispatch(switchGameDifficulty());
    this.startNewGame();
  }

  resetGame() {
    this.store.dispatch(resetPlayers());
    this.store.dispatch(resetDraws());
  }

  startNewGame() {
    this.resetGame();
    this.gameMode$.pipe(take(1)).subscribe((gameMode) => {
      this.store.dispatch(startGame({ gameMode }));
    });
  }
}
