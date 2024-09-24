import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardComponent } from './game-board.component';
import { Square } from '../models/square';

const GAME_BOARD_MOCK: Square[] = [
  { gamePiece: 'X', isWinner: true },
  { gamePiece: 'X', isWinner: true },
  { gamePiece: 'X', isWinner: true },
  { gamePiece: '', isWinner: false },
  { gamePiece: '', isWinner: false },
  { gamePiece: '', isWinner: false },
  { gamePiece: '', isWinner: false },
  { gamePiece: '', isWinner: false },
  { gamePiece: '', isWinner: false },
];

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should determine that x is the winner if they play the top row', () => {
    let winner = component.calculateWinner(GAME_BOARD_MOCK);
    expect(winner).toBe('X');
  });

  it('should animate the top row if x chooses the top row and wins', () => {
    let winner = component.calculateWinner(GAME_BOARD_MOCK);
  });
});
