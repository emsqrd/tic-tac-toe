import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ScoringComponent } from './scoring.component';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { Player } from '../../models/player';
import { GameState } from '../../store/game/game.reducer';
import { PlayerState } from '../../store/player/player.reducer';
import { getInitialPlayerStateMock } from '../../store/mocks/player-mocks';
import { getInitialGameStateMock } from '../../store/mocks/game-mocks';
import { selectCurrentPlayer } from '../../store/player/player.selectors';
import { selectOutcome } from '../../store/round/round.selectors';
import { getInitialRoundStateMock } from '../../store/mocks/round-mocks';
import { RoundState } from '../../store/round/round.reducer';

describe('ScoringComponent', () => {
  let component: ScoringComponent;
  let fixture: ComponentFixture<ScoringComponent>;
  let storeMock: MockStore;
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let initialRoundStateMock: RoundState;
  let currentPlayerMock: Player;

  beforeEach(async () => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
    initialRoundStateMock = getInitialRoundStateMock();

    await TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            game: initialGameStateMock,
            player: initialPlayerStateMock,
            round: initialRoundStateMock,
          },
        }),
      ],
    }).compileComponents();

    storeMock = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ScoringComponent);

    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
    initialRoundStateMock = getInitialRoundStateMock();

    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    storeMock.resetSelectors();
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
    component.currentPlayer = currentPlayerMock;
    expect(component.selectPlayer1).toBeTrue();
  });

  it('should return true for selectPlayer1 when isResult is true', () => {
    component.outcome = OutcomeEnum.Win;
    expect(component.selectPlayer1).toBeTrue();
  });

  it('should return true for selectPlayer2 when current player is player2', () => {
    component.currentPlayer = {
      name: 'Player 2',
      piece: 'O',
      wins: 0,
      isCpu: false,
    };
    expect(component.selectPlayer2).toBeTrue();
  });

  it('should return true for selectPlayer2 when isResult is true', () => {
    component.outcome = OutcomeEnum.Win;
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
});
