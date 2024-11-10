import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
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
import { Player } from '../../models/player';
import { selectCurrentPlayer } from '../../store/player/player.selectors';
import { Square } from '../../models/square';
import { GameModeEnum } from '../../enums/game-mode.enum';
import {
  selectGameBoard,
  selectOutcome,
  selectProcessingMove,
} from '../../store/round/round.selectors';
import { RoundActions } from '../../store/round/round.actions';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';

@Component({
  selector: 't3-game-board',
  standalone: true,
  imports: [CommonModule, SquareComponent, ScoringComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit {
  gameBoard$: Observable<Square[]>;
  outcome$: Observable<OutcomeEnum>;
  currentPlayer$: Observable<Player>;
  gameMode$: Observable<GameModeEnum>;
  processingMove$: Observable<boolean>;
  gameDifficulty$: Observable<GameDifficultyEnum>;

  gameBoard!: Square[];
  outcome!: OutcomeEnum;
  currentPlayer!: Player;
  gameMode!: GameModeEnum;
  gameDifficulty!: GameDifficultyEnum;

  constructor(private store: Store) {
    this.gameBoard$ = store.select(selectGameBoard);
    this.outcome$ = store.select(selectOutcome);
    this.currentPlayer$ = store.select(selectCurrentPlayer);
    this.gameMode$ = store.select(selectGameMode);
    this.processingMove$ = store.select(selectProcessingMove);
    this.gameDifficulty$ = store.select(selectGameDifficulty);
  }

  get isDraw() {
    return this.outcome === OutcomeEnum.Draw;
  }

  get moveDelay() {
    return this.currentPlayer.isCpu ? 500 : 0;
  }

  get gameModeButtonText() {
    return this.gameMode.valueOf();
  }

  get gameDifficultyButtonText() {
    return this.gameDifficulty.valueOf();
  }

  get showDifficultyButton() {
    return this.gameMode === GameModeEnum.SinglePlayer;
  }

  get showComingSoon() {
    return this.gameDifficulty !== GameDifficultyEnum.Easy;
  }

  // Start the game when the component is initialized
  ngOnInit(): void {
    this.outcome$.subscribe((outcome) => {
      this.outcome = outcome;
    });

    this.currentPlayer$.subscribe((player) => {
      this.currentPlayer = player;
    });

    this.gameMode$.subscribe((gameMode) => {
      this.gameMode = gameMode;
    });

    this.gameDifficulty$.subscribe((gameDifficulty) => {
      this.gameDifficulty = gameDifficulty;
    });

    this.gameBoard$.subscribe((gameBoard) => {
      this.gameBoard = gameBoard;
    });

    this.store.dispatch(startGame({ gameMode: this.gameMode }));
  }

  // Clicking a square triggers a move
  // If the game is over, clicking a square should start a new game
  //  and switch the player
  squareClick(position: number) {
    if (this.outcome !== OutcomeEnum.None) {
      this.store.dispatch(startGame({ gameMode: this.gameMode }));
      this.store.dispatch(switchPlayer());
    } else {
      this.attemptMove(position);
    }
  }

  attemptMove(position: number) {
    if (this.gameBoard[position].gamePiece !== '') {
      return;
    }

    this.store.dispatch(RoundActions.makeHumanMove({ position }));
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
    this.store.dispatch(startGame({ gameMode: this.gameMode }));
  }
}
