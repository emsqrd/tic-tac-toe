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
    return false;
  }

  get hasWinner(): boolean {
    return this.gameBoard?.some((square) => square.isWinner) || false;
  }

  get winningPattern(): string {
    // Find the winning squares
    const winningSquares = this.gameBoard
      .map((square, index) => ({ ...square, index }))
      .filter((square) => square.isWinner);

    if (winningSquares.length === 0) return '';

    const indices = winningSquares
      .map((square) => square.index)
      .sort((a, b) => a - b);

    // Rows: [0,1,2], [3,4,5], [6,7,8]
    if (Math.floor(indices[0] / 3) === Math.floor(indices[1] / 3)) return 'row';

    // Columns: [0,3,6], [1,4,7], [2,5,8]
    if (indices[0] % 3 === indices[1] % 3) return 'column';

    // Diagonals: [0,4,8], [2,4,6]
    if (indices.includes(4)) {
      if (indices.includes(0)) return 'diagonal';
      if (indices.includes(2)) return 'antiDiagonal';
    }
    return '';
  }

  get lineStart(): { x: number; y: number } {
    const pattern = this.winningPattern;
    const coordinates = {
      row: {
        x: 0,
        y:
          50 +
          Math.floor(this.gameBoard.findIndex((s) => s.isWinner) / 3) * 100,
      },
      column: {
        x: 50 + (this.gameBoard.findIndex((s) => s.isWinner) % 3) * 100,
        y: 0,
      },
      diagonal: { x: 0, y: 0 },
      antiDiagonal: { x: 300, y: 0 },
    };
    return coordinates[pattern as keyof typeof coordinates] || { x: 0, y: 0 };
  }

  get lineEnd(): { x: number; y: number } {
    const pattern = this.winningPattern;
    const coordinates = {
      row: { x: 300, y: this.lineStart.y },
      column: { x: this.lineStart.x, y: 300 },
      diagonal: { x: 300, y: 300 },
      antiDiagonal: { x: 0, y: 300 },
    };
    return coordinates[pattern as keyof typeof coordinates] || { x: 0, y: 0 };
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
