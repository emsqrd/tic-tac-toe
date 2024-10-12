import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Square } from '../../models/square';
import { SquareComponent } from '../square/square.component';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';
import { OutcomeEnum } from '../../models/outcome.enum';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectBoard } from '../../store/selectors/game.selectors';
import { GameState } from '../../store/reducers/game.reducer';

@Component({
  selector: 't3-board',
  standalone: true,
  imports: [SquareComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  // @Input() currentPlayer!: Player;
  @Input() currentMove!: number;
  // @Input() outcome!: OutcomeEnum;
  board$: Observable<Square[]> | undefined;

  @Output() handleBoardClick: EventEmitter<any> = new EventEmitter();
  @Output() startTurn: EventEmitter<any> = new EventEmitter();
  @Output() endTurn: EventEmitter<any> = new EventEmitter();
  @Output() startGame: EventEmitter<any> = new EventEmitter();
  @Output() endGame: EventEmitter<any> = new EventEmitter();

  constructor(private store: Store<GameState>) {
    this.board$ = this.store.select(selectBoard);
  }

  // gameBoard: Square[] = [];

  // public buildGameBoard() {
  //   this.gameBoard = [];

  //   for (let i = 0; i < 9; i++) {
  //     let square: Square = {
  //       gamePiece: '',
  //       isWinner: false,
  //     };

  //     this.gameBoard.push(square);
  //   }
  // }

  squareClick(squareIndex: number) {
    this.handleBoardClick.emit(squareIndex);
    // this.startTurn.emit(squareIndex);
    // if (this.outcome === OutcomeEnum.None) {
    //   this.processTurn(square, this.currentPlayer.piece);
    // } else {
    //   this.startGame.emit();
    // }
  }

  // public processTurn(square: number, gamePiece: string) {
  //   this.addPieceToBoard(square, gamePiece);
  //   this.determineOutcome();
  // }

  // public addPieceToBoard(square: number, gamePiece: string) {
  //   this.gameBoard[square].gamePiece = gamePiece;
  // }

  // public determineOutcome() {
  //   let winCondition = this.determineWinCondition(this.gameBoard);
  //   let outcome: OutcomeEnum = OutcomeEnum.None;
  //   if (winCondition === OutcomeEnum.Win) {
  //     outcome = winCondition;
  //     this.endGame.emit(outcome);
  //   } else if (this.currentMove === this.gameBoard.length) {
  //     outcome = OutcomeEnum.Draw;
  //     this.endGame.emit(outcome);
  //   } else {
  //     this.endTurn.emit();
  //   }
  // }

  // public determineWinCondition(gameBoard: Square[]): OutcomeEnum {
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
  //       return OutcomeEnum.Win;
  //     }
  //   }
  //   return OutcomeEnum.None;
  // }

  // private setWinningGamePieces([a, b, c]: [number, number, number]) {
  //   [this.gameBoard[a], this.gameBoard[b], this.gameBoard[c]].forEach(
  //     (x) => (x.isWinner = true)
  //   );
  // }

  // ngOnInit(): void {
  //   this.buildGameBoard();
  // }
}
