import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 't3-square',
  imports: [CommonModule],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss',
})
export class SquareComponent {
  @Input() isWinner = false;
  @Input() winType?: 'row' | 'column' | 'diagonal' | 'antiDiagonal';
  @Input() gamePiece!: string | undefined;

  displayGridLines: boolean = false;

  get displayXPiece(): boolean {
    return this.gamePiece === 'X';
  }

  get displayOPiece(): boolean {
    return this.gamePiece === 'O';
  }
}
