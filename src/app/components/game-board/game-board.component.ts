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
} from '../../store/game/game.actions';
import { selectGameMode } from '../../store/game/game.selectors';
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

  outcome!: OutcomeEnum;
  currentPlayer!: Player;
  gameMode!: GameModeEnum;

  gameModeValue!: string;
  enableSinglePlayer = true;

  constructor(private store: Store) {
    this.gameBoard$ = store.select(selectGameBoard);
    this.outcome$ = store.select(selectOutcome);
    this.currentPlayer$ = store.select(selectCurrentPlayer);
    this.gameMode$ = store.select(selectGameMode);
    this.processingMove$ = store.select(selectProcessingMove);
  }

  get isDraw() {
    return this.outcome === OutcomeEnum.Draw;
  }

  get gameModeButtonText() {
    return this.gameModeValue === GameModeEnum.TwoPlayer
      ? 'Two Player'
      : 'Single Player';
  }

  get showComingSoon() {
    return (
      this.gameMode === GameModeEnum.SinglePlayer && !this.enableSinglePlayer
    );
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
      this.gameModeValue = gameMode.valueOf();
    });

    this.processingMove$.subscribe((processingMove) => {
      console.log('Processing move:', processingMove);
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
      this.store.dispatch(RoundActions.attemptMove({ position }));
    }
  }

  gameModeClick() {
    this.store.dispatch(switchGameMode());
    this.store.dispatch(resetPlayers());
    this.store.dispatch(resetDraws());
    this.store.dispatch(startGame({ gameMode: this.gameMode }));
  }
}
