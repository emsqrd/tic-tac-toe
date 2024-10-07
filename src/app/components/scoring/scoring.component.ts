import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 't3-scoring',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoring.component.html',
  styleUrl: './scoring.component.scss',
})
export class ScoringComponent {
  @Input() player1IsWinner: boolean = false;
  @Input() player1IsCurrent: boolean = false;
  @Input() player1Wins: number = 0;

  @Input() player2IsWinner: boolean = false;
  @Input() player2IsCurrent: boolean = false;
  @Input() player2Wins: number = 0;

  @Input() isDraw: boolean = false;
  @Input() draws: number = 0;
}
