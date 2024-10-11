import { Component, ViewChild } from '@angular/core';
import { Player } from '../../models/player';
import { CommonModule } from '@angular/common';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import { BoardComponent } from '../board/board.component';
import { OutcomeEnum } from '../../models/outcome.enum';

@Component({
  selector: 't3-game-board',
  standalone: true,
  imports: [CommonModule, SquareComponent, ScoringComponent, BoardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  @ViewChild(BoardComponent) boardComponent!: BoardComponent;

  player1: Player = {
    name: 'Player 1',
    piece: 'X',
    wins: 0,
    isCurrent: true,
    isWinner: false,
  };

  player2: Player = {
    name: 'Player 2',
    piece: 'O',
    wins: 0,
    isCurrent: false,
    isWinner: false,
  };

  players: Player[] = [this.player1, this.player2];
  currentPlayerIndex = 0;
  currentPlayer: Player = this.players[0];
  outcome: OutcomeEnum = OutcomeEnum.None;

  currentMove: number = 1;
  draws = 0;

  isDraw = false;

  handleBoardClick(squareIndex: number) {
    if (this.outcome === OutcomeEnum.None) {
      this.startTurn(squareIndex);
    } else {
      this.startGame();
    }
  }

  startGame() {
    console.log('start game...');
    this.isDraw = false;
    this.currentMove = 1;
    this.outcome = OutcomeEnum.None;
    this.boardComponent.buildGameBoard();
  }

  startTurn(squareIndex: number) {
    this.processTurn(squareIndex);
  }

  processTurn(gamePieceIndex: number) {
    this.boardComponent.processTurn(gamePieceIndex, this.currentPlayer.piece);
  }

  endTurn() {
    this.currentMove++;
    this.switchPlayer();
  }

  // May want to refactor this a bit more after incorporating game state?
  endGame(outcome: OutcomeEnum) {
    // Move this to the scoring component
    if (outcome === OutcomeEnum.Win) {
      this.currentPlayer === this.player1
        ? this.player1.wins++
        : this.player2.wins++;
    } else if (outcome === OutcomeEnum.Draw) {
      this.isDraw = true;
      this.draws++;
    }
    this.outcome = outcome;
    this.switchPlayer();
  }

  switchPlayer() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;

    this.currentPlayer = this.players[this.currentPlayerIndex];
  }

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

  ngAfterViewInit() {
    this.startGame();
  }
}
