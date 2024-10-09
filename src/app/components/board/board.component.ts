import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Square } from '../../models/square';
import { SquareComponent } from '../square/square.component';
import { Player } from '../../models/player';
import { OutcomeEnum } from '../../models/outcome.enum';

@Component({
  selector: 't3-board',
  standalone: true,
  imports: [SquareComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @Input() currentPlayer!: Player;

  @Output() endTurn: EventEmitter<any> = new EventEmitter();
  @Output() endGame: EventEmitter<any> = new EventEmitter();

  gameBoard: Square[] = [];

  outcome: OutcomeEnum = OutcomeEnum.None;

  isDraw: boolean = false;
  gameOver: boolean = false;
  currentMove = 1;
  // get winningResult(): boolean {
  //   return this.player1.isWinner || this.player2.isWinner;
  // }

  // get isGameOver(): boolean {
  //   return this.isDraw || this.winningResult;
  // }

  private buildGameBoard() {
    this.gameBoard = [];

    for (let i = 0; i < 9; i++) {
      let square: Square = {
        gamePiece: '',
        isWinner: false,
      };

      this.gameBoard.push(square);
    }
  }

  private resetBoard() {
    this.buildGameBoard();
    this.outcome = OutcomeEnum.None;
    // this.gameOver = false;
    // this.isDraw = false;
  }

  squareClick(square: number) {
    if (this.outcome === OutcomeEnum.None) {
      this.takeTurn(square, this.currentPlayer.piece);
    } else {
      this.resetBoard();
    }
  }

  private takeTurn(square: number, gamePiece: string) {
    this.processTurn(square, gamePiece);
    this.completeTurn();
  }

  private processTurn(square: number, gamePiece: string) {
    this.gameBoard[square].gamePiece = gamePiece;

    this.determineOutcome();
  }

  private completeTurn() {
    if (this.outcome === OutcomeEnum.None) {
      this.endTurn.emit(this.outcome);
    } else {
      this.endGame.emit(this.outcome);
    }
  }

  private determineOutcome() {
    let winner = this.calculateWinner(this.gameBoard);

    if (winner) {
      this.outcome = OutcomeEnum.Win;
    } else if (this.currentMove === this.gameBoard.length) {
      this.outcome = OutcomeEnum.Draw;
    }
  }

  // private setWinner() {
  //   this.currentPlayer.isWinner = true;
  //   this.outcome = OutcomeEnum.Win;
  // }

  private calculateWinner(gameBoard: Square[]) {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (
        gameBoard[a].gamePiece &&
        gameBoard[a].gamePiece === gameBoard[b].gamePiece &&
        gameBoard[a].gamePiece === gameBoard[c].gamePiece
      ) {
        this.setWinningGamePieces([a, b, c]);
        return gameBoard[a].gamePiece;
      }
    }
    return null;
  }

  private setWinningGamePieces([a, b, c]: [number, number, number]) {
    [this.gameBoard[a], this.gameBoard[b], this.gameBoard[c]].forEach(
      (x) => (x.isWinner = true)
    );
  }

  ngOnInit(): void {
    this.buildGameBoard();
  }
  // makeMove(square: number, playerPiece: string) {
  //   if (this.gameBoard[square].gamePiece) {
  //     return;
  //   }

  //   this.gameBoard[square].gamePiece = playerPiece;

  //   this.determineResult();

  //   if (!this.isGameOver) {
  //     this.setCurrentPlayer();

  //     this.currentMove++;
  //   }
  // }
}
