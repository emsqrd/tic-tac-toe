import { Component, ViewChild } from '@angular/core';
import { Player } from '../../models/player';
import { CommonModule } from '@angular/common';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import { BoardComponent } from '../board/board.component';
import { OutcomeEnum } from '../../models/outcome.enum';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameState } from '../../store/reducers/game.reducer';
import {
  selectBoard,
  selectCurrentPlayer,
  selectOutcome,
  selectPlayers,
} from '../../store/selectors/game.selectors';
import { Square } from '../../models/square';

@Component({
  selector: 't3-game-board',
  standalone: true,
  imports: [CommonModule, SquareComponent, ScoringComponent, BoardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  // @ViewChild(BoardComponent) boardComponent!: BoardComponent;

  players$: Observable<Player[]> | undefined;
  currentPlayer$: Observable<Player> | undefined;
  outcome$: Observable<OutcomeEnum> | undefined;

  constructor(private store: Store<GameState>) {
    this.players$ = this.store.select(selectPlayers);
    this.currentPlayer$ = this.store.select(selectCurrentPlayer);
    this.outcome$ = this.store.select(selectOutcome);
  }

  startGame() {
    console.log('Starting game');
    this.store.dispatch({ type: '[Game] Start Game' });
  }

  makeMove(position: number) {
    this.currentPlayer$?.subscribe((currentPlayer) => {
      this.store.dispatch({
        type: '[Game] Make Move',
        player: currentPlayer,
        position,
      });
    });
    // this.store.dispatch({ type: '[Game] Make Move', position });
  }

  endGame(outcome: OutcomeEnum) {
    this.store.dispatch({ type: '[Game] End Game', outcome });
  }

  resetGame() {
    this.store.dispatch({ type: '[Game] Reset Game' });
  }

  handleBoardClick(squareIndex: number) {
    this.makeMove(squareIndex);
    // if (this.outcome === OutcomeEnum.None) {
    //   this.startTurn(squareIndex);
    // } else {
    //   this.startGame();
    // }
  }

  ngOnInit() {
    this.startGame();
  }
  // startGame() {
  //   this.isDraw = false;
  //   this.currentMove = 1;
  //   this.outcome = OutcomeEnum.None;
  //   this.boardComponent.buildGameBoard();
  // }

  // startTurn(squareIndex: number) {
  //   this.processTurn(squareIndex);
  // }

  // processTurn(gamePieceIndex: number) {
  //   this.boardComponent.processTurn(gamePieceIndex, this.currentPlayer.piece);
  // }

  // endTurn() {
  //   this.currentMove++;
  //   this.switchPlayer();
  // }

  // // May want to refactor this a bit more after incorporating game state?
  // endGame(outcome: OutcomeEnum) {
  //   // Move this to the scoring component
  //   if (outcome === OutcomeEnum.Win) {
  //     this.currentPlayer === this.player1
  //       ? this.player1.wins++
  //       : this.player2.wins++;
  //   } else if (outcome === OutcomeEnum.Draw) {
  //     this.isDraw = true;
  //     this.draws++;
  //   }
  //   this.outcome = outcome;
  //   this.switchPlayer();
  // }

  // switchPlayer() {
  //   this.currentPlayerIndex =
  //     (this.currentPlayerIndex + 1) % this.players.length;

  //   this.currentPlayer = this.players[this.currentPlayerIndex];
  // }

  // private takeTurn(square: number, gamePiece: string) {
  //   this.completeTurn();
  // }

  // private completeTurn() {
  //   if (this.outcome === OutcomeEnum.None) {
  //     this.currentMove++;
  //     this.endTurn.emit(this.outcome);
  //   } else {
  //     this.endGame.emit(this.outcome);
  //   }
  // }

  // private determineOutcome() {
  //   this.boardComponent.determineOutcome();

  //   // let winner = this.calculateWinner(this.gameBoard);

  //   // if (winner) {
  //   //   this.outcome = OutcomeEnum.Win;
  //   // } else if (this.currentMove === this.gameBoard.length) {
  //   //   this.outcome = OutcomeEnum.Draw;
  //   // }
  // }

  // ngAfterViewInit() {
  //   this.startGame();
  // }
}
