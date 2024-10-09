import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Square } from '../../models/square';
import { SquareComponent } from '../square/square.component';
import { Player } from '../../models/player';

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

  gameBoard: Square[] = [];

  isDraw: boolean = false;
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

  squareClick(square: number) {
    this.takeTurn(square, this.currentPlayer.piece);
    // if (!this.isGameOver) {
    //   this.makeMove(square, this.currentPlayer.piece);
    // } else {
    //   this.resetBoard();
    // }
  }

  takeTurn(square: number, gamePiece: string) {
    this.processTurn(square, gamePiece);

    this.endTurn.emit(this.currentPlayer);
  }

  processTurn(square: number, gamePiece: string) {
    this.gameBoard[square].gamePiece = gamePiece;

    this.determineOutcome();
  }

  private determineOutcome() {
    let winner = this.calculateWinner(this.gameBoard);

    if (winner) {
      this.setWinner(winner);
    }
    // else if (this.currentMove === this.gameBoard.length) {
    //   // Is there a better way to determine a draw?
    //   this.isDraw = true;
    //   this.draws++;
    // }
  }

  setWinner(winner: string) {
    this.currentPlayer.isWinner = true;
  }

  calculateWinner(gameBoard: Square[]) {
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

  setWinningGamePieces([a, b, c]: [number, number, number]) {
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

  // resetBoard() {
  //   this.buildGameBoard();
  //   this.currentMove = 1;
  //   this.isDraw = false;
  //   this.player1.isWinner = false;
  //   this.player2.isWinner = false;
  //   this.setCurrentPlayer();
  // }
}
