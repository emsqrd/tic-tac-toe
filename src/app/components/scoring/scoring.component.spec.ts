import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ScoringComponent } from './scoring.component';
import { OutcomeEnum } from '../../enums/outcome.enum';

describe('ScoringComponent', () => {
  let component: ScoringComponent;
  let fixture: ComponentFixture<ScoringComponent>;
  let store: MockStore;
  const initialState = {
    game: {
      gameBoard: Array(9).fill({ gamePiece: '', isWinner: false }),
      outcome: OutcomeEnum.None,
      draws: 0,
    },
    player: {
      players: [
        { name: 'Player 1', piece: 'X', wins: 0 },
        { name: 'Player 2', piece: 'O', wins: 0 },
      ],
      currentPlayerIndex: 0,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select players from the store', (done) => {
    component.players$.subscribe((players) => {
      expect(players.length).toBe(2);
      expect(players[0].name).toBe('Player 1');
      expect(players[1].name).toBe('Player 2');
      done();
    });
  });

  it('should select current player from the store', (done) => {
    component.currentPlayer$.subscribe((currentPlayer) => {
      expect(currentPlayer.name).toBe('Player 1');
      done();
    });
  });

  it('should select outcome from the store', (done) => {
    component.outcome$.subscribe((outcome) => {
      expect(outcome).toBe(OutcomeEnum.None);
      done();
    });
  });

  it('should select draws from the store', (done) => {
    component.draws$.subscribe((draws) => {
      expect(draws).toBe(0);
      done();
    });
  });

  it('should return true for isResult when outcome is Win', () => {
    component.outcome = OutcomeEnum.Win;
    expect(component.isResult).toBeTrue();
  });

  it('should return true for isResult when outcome is Draw', () => {
    component.outcome = OutcomeEnum.Draw;
    expect(component.isResult).toBeTrue();
  });

  it('should return false for isResult when outcome is None', () => {
    component.outcome = OutcomeEnum.None;
    expect(component.isResult).toBeFalse();
  });

  it('should return true for selectPlayer1 when current player is player1', () => {
    component.currentPlayer = { name: 'Player 1', piece: 'X', wins: 0 };
    expect(component.selectPlayer1).toBeTrue();
  });

  it('should return true for selectPlayer2 when current player is player2', () => {
    component.currentPlayer = { name: 'Player 2', piece: 'O', wins: 0 };
    expect(component.selectPlayer2).toBeTrue();
  });

  it('should return true for selectDraw when outcome is Draw', () => {
    component.outcome = OutcomeEnum.Draw;
    expect(component.selectDraw).toBeTrue();
  });

  it('should return true for isDraw when outcome is Draw', () => {
    component.outcome = OutcomeEnum.Draw;
    expect(component.isDraw).toBeTrue();
  });

  it('should return true for player1Wins when current player is player1 and outcome is Win', () => {
    component.currentPlayer = { name: 'Player 1', piece: 'X', wins: 0 };
    component.outcome = OutcomeEnum.Win;
    expect(component.player1Wins).toBeTrue();
  });

  it('should return true for player2Wins when current player is player2 and outcome is Win', () => {
    component.currentPlayer = { name: 'Player 2', piece: 'O', wins: 0 };
    component.outcome = OutcomeEnum.Win;
    expect(component.player2Wins).toBeTrue();
  });
});
