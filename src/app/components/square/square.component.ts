import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Square } from '../../models/square';

@Component({
  selector: 't3-square',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss',
})
export class SquareComponent {
  @Input() isWinner: boolean | undefined;
  @Input() gamePiece!: string | undefined;

  get displayXPiece(): boolean {
    return this.gamePiece === 'X';
  }

  get displayOPiece(): boolean {
    return this.gamePiece === 'O';
  }
}
