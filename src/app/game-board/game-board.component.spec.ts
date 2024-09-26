import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardComponent } from './game-board.component';
import { Square } from '../models/square';

const GAME_BOARD_X_WINS_MOCK: Square[] = [
  { gamePiece: 'X', isWinner: true },
  { gamePiece: 'X', isWinner: true },
  { gamePiece: 'X', isWinner: true },
  { gamePiece: 'O', isWinner: false },
  { gamePiece: '', isWinner: false },
  { gamePiece: 'O', isWinner: false },
  { gamePiece: '', isWinner: false },
  { gamePiece: '', isWinner: false },
  { gamePiece: '', isWinner: false },
];

const GAME_BOARD_O_WINS_MOCK: Square[] = [
  { gamePiece: 'X', isWinner: false },
  { gamePiece: '', isWinner: false },
  { gamePiece: 'X', isWinner: false },
  { gamePiece: 'O', isWinner: true },
  { gamePiece: 'O', isWinner: true },
  { gamePiece: 'O', isWinner: true },
  { gamePiece: '', isWinner: false },
  { gamePiece: '', isWinner: false },
  { gamePiece: '', isWinner: false },
];

const GAME_BOARD_DRAW_MOCK: Square[] = [
  { gamePiece: 'X', isWinner: false },
  { gamePiece: 'O', isWinner: false },
  { gamePiece: 'X', isWinner: false },
  { gamePiece: 'X', isWinner: false },
  { gamePiece: 'O', isWinner: false },
  { gamePiece: 'O', isWinner: false },
  { gamePiece: 'O', isWinner: false },
  { gamePiece: 'X', isWinner: false },
  { gamePiece: 'O', isWinner: false },
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

  it('should result in X winning', () => {
    // let winner = component.calculateWinner(GAME_BOARD_X_WINS_MOCK);
    // expect(winner).toBe('X');
    component.squareClick(0, 'X');
    component.squareClick(4, 'O');
    component.squareClick(1, 'X');
    component.squareClick(5, 'O');
    component.squareClick(2, 'X');

    expect(component.player1.isWinner).toBeTrue();
    expect(component.player2.isWinner).toBeFalse();
  });

  it('should result in O winning', () => {
    // let winner = component.calculateWinner(GAME_BOARD_O_WINS_MOCK);
    // expect(winner).toBe('O');

    component.squareClick(0, 'O');
    component.squareClick(4, 'X');
    component.squareClick(1, 'O');
    component.squareClick(5, 'X');
    component.squareClick(2, 'O');

    expect(component.player2.isWinner).toBeTrue();
  });

  it('should result in a draw', () => {
    let winner = component.calculateWinner(GAME_BOARD_DRAW_MOCK);
    let currentMove = GAME_BOARD_DRAW_MOCK.filter(
      (x) => x.gamePiece?.includes('X') || x.gamePiece?.includes('O')
    ).length;

    expect(winner).toBeNull();
    expect(currentMove).toBe(GAME_BOARD_DRAW_MOCK.length);
  });

  it('should result in x winning on last turn', () => {});

  xit('should animate the top row if x chooses the top row and wins', () => {
    // let winner = component.calculateWinner(GAME_BOARD_MOCK);
  });
});
