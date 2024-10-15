import { Component, OnInit } from '@angular/core';
import { Player } from '../../models/player';
import { Square } from '../../models/square';
import { CommonModule } from '@angular/common';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameState } from '../../store/game/game.reducer';
import { makeMove, startGame } from '../../store/game/game.actions';

@Component({
  selector: 't3-game-board',
  standalone: true,
  imports: [CommonModule, SquareComponent, ScoringComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit {
  gameBoard$: Observable<Square[]>;
  currentPlayer$: Observable<Player>;
  winner$: Observable<Player | null>;

  isDraw: boolean = false;

  constructor(private store: Store<{ game: GameState }>) {
    this.gameBoard$ = store.select((state) => state.game.gameBoard);
    this.currentPlayer$ = store.select((state) => state.game.currentPlayer);
    this.winner$ = store.select((state) => state.game.winner);
  }

  ngOnInit(): void {
    this.store.dispatch(startGame());
  }

  squareClick(position: number) {
    this.store.dispatch(makeMove({ position }));
  }

  // private determineResult() {
  //   let winner = this.calculateWinner(this.gameBoard);

  //   if (winner) {
  //     this.setWinner(winner);
  //   } else if (this.gameBoard.every((square) => square.gamePiece !== '')) {
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
}
