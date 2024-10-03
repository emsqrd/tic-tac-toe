import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 't3-square',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss',
})
export class SquareComponent {
  @Input() isWinner: boolean = false;
  @Input() gamePiece = '';

  @Output() squareClicked = new EventEmitter<number>();

  handleSquareClick() {
    this.squareClicked.emit();
  }
}
