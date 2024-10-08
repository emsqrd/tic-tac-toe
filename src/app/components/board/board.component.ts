import { Component, Input } from '@angular/core';
import { Square } from '../../models/square';
import { SquareComponent } from '../square/square.component';

@Component({
  selector: 't3-board',
  standalone: true,
  imports: [SquareComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
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
    // if (!this.isGameOver) {
    //   this.makeMove(square, this.currentPlayer.piece);
    // } else {
    //   this.resetBoard();
    // }
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

  // private determineResult() {
  //   let winner = this.calculateWinner(this.gameBoard);

  //   if (winner) {
  //     this.setWinner(winner);
  //   } else if (this.currentMove === this.gameBoard.length) {
  //     // Is there a better way to determine a draw?
  //     this.isDraw = true;
  //     this.draws++;
  //   }
  // }

  // setWinner(winner: string) {
  //   switch (winner) {
  //     case this.player1.piece:
  //       this.player1.isWinner = true;
  //       this.player1.wins++;
  //       break;
  //     case this.player2.piece:
  //       this.player2.isWinner = true;
  //       this.player2.wins++;
  //       break;
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

  // calculateWinner(gameBoard: Square[]) {
  //   const winConditions = [
  //     [0, 1, 2],
  //     [3, 4, 5],
  //     [6, 7, 8],
  //     [0, 3, 6],
  //     [1, 4, 7],
  //     [2, 5, 8],
  //     [0, 4, 8],
  //     [2, 4, 6],
  //   ];

  //   for (let i = 0; i < winConditions.length; i++) {
  //     const [a, b, c] = winConditions[i];
  //     if (
  //       gameBoard[a].gamePiece &&
  //       gameBoard[a].gamePiece === gameBoard[b].gamePiece &&
  //       gameBoard[a].gamePiece === gameBoard[c].gamePiece
  //     ) {
  //       this.setWinningGamePieces([a, b, c]);
  //       return gameBoard[a].gamePiece;
  //     }
  //   }
  //   return null;
  // }

  // setWinningGamePieces([a, b, c]: [number, number, number]) {
  //   [this.gameBoard[a], this.gameBoard[b], this.gameBoard[c]].forEach(
  //     (x) => (x.isWinner = true)
  //   );
  // }

  ngOnInit(): void {
    this.buildGameBoard();
  }
}
