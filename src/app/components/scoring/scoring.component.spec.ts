import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ScoringComponent } from './scoring.component';
import { OutcomeEnum } from '../../enums/outcome.enum';
import { Player } from '../../models/player';
import { GameState } from '../../store/game/game.reducer';
import { PlayerState } from '../../store/player/player.reducer';
import { getInitialPlayerStateMock } from '../../store/mocks/player-mocks';
import { getInitialGameStateMock } from '../../store/mocks/game-mocks';
import { getInitialRoundStateMock } from '../../store/mocks/round-mocks';
import { RoundState } from '../../store/round/round.reducer';
import { firstValueFrom } from 'rxjs';

describe('ScoringComponent', () => {
  let component: ScoringComponent;
  let fixture: ComponentFixture<ScoringComponent>;
  let storeMock: MockStore;
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let initialRoundStateMock: RoundState;
  let currentPlayerMock: Player;

  beforeAll(() => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
    initialRoundStateMock = getInitialRoundStateMock();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            game: initialGameStateMock,
            player: initialPlayerStateMock,
            round: initialRoundStateMock,
          },
        }),
      ],
    });

    storeMock = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ScoringComponent);
    component = fixture.componentInstance;
    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    storeMock.resetSelectors();
  });

  describe('initialization', () => {
    test('should create component', () => {
      expect(component).toBeDefined();
    });
  });

  describe('store selectors', () => {
    test('should fetch players from store', async () => {
      const players = await firstValueFrom(component.players$);

      expect(players).toHaveLength(2);
      expect(players[0]).toEqual(expect.objectContaining({ name: 'Player 1' }));
      expect(players[1]).toEqual(expect.objectContaining({ name: 'Player 2' }));
    });

    test('should fetch current player from store', async () => {
      const currentPlayer = await firstValueFrom(component.currentPlayer$);
      expect(currentPlayer).toEqual(
        expect.objectContaining({ name: 'Player 1' })
      );
    });

    test('should fetch outcome from store', async () => {
      const outcome = await firstValueFrom(component.outcome$);
      expect(outcome).toBe(OutcomeEnum.None);
    });

    test('should fetch draws count from store', async () => {
      const draws = await firstValueFrom(component.draws$);
      expect(draws).toBe(0);
    });
  });

  describe('game state conditions', () => {
    describe('isResult', () => {
      test.each([
        [OutcomeEnum.Win, true],
        [OutcomeEnum.Draw, true],
        [OutcomeEnum.None, false],
      ])('when outcome is %s, should return %s', (outcome, expected) => {
        component.outcome = outcome;
        expect(component.isResult).toBe(expected);
      });
    });

    describe('player selection', () => {
      test.each([
        [
          'currentPlayer is player1',
          () => {
            component.currentPlayer = currentPlayerMock;
          },
        ],
        [
          'game has result',
          () => {
            component.outcome = OutcomeEnum.Win;
          },
        ],
      ])('should select player1 when %s', (_, setup) => {
        setup();
        expect(component.selectPlayer1).toBe(true);
      });

      test.each([
        [
          'currentPlayer is player2',
          () => {
            component.currentPlayer = {
              name: 'Player 2',
              piece: 'O',
              wins: 0,
              isCpu: false,
            };
          },
        ],
        [
          'game has result',
          () => {
            component.outcome = OutcomeEnum.Win;
          },
        ],
      ])('should select player2 when %s', (_, setup) => {
        setup();
        expect(component.selectPlayer2).toBe(true);
      });
    });

    describe('draw conditions', () => {
      beforeEach(() => {
        component.outcome = OutcomeEnum.Draw;
      });

      test('should indicate draw selection', () => {
        expect(component.selectDraw).toBe(true);
      });

      test('should indicate game is a draw', () => {
        expect(component.isDraw).toBe(true);
      });
    });

    describe('selectPlayer1 combinations', () => {
      beforeEach(() => {
        component.player1 = {
          name: 'Player 1',
          piece: 'X',
          wins: 0,
          isCpu: false,
        };
      });

      test.each([
        [
          'matches current player and no result',
          'Player 1',
          OutcomeEnum.None,
          true,
        ],
        [
          'matches current player with result',
          'Player 1',
          OutcomeEnum.Win,
          true,
        ],
        [
          'is different player but has result',
          'Player 2',
          OutcomeEnum.Win,
          true,
        ],
        [
          'is different player and no result',
          'Player 2',
          OutcomeEnum.None,
          false,
        ],
      ])(
        'when currentPlayer %s',
        (
          scenario: string,
          playerName: string,
          outcome: OutcomeEnum,
          expected: boolean
        ) => {
          // Arrange
          component.currentPlayer = {
            name: playerName,
            piece: playerName === 'Player 1' ? 'X' : 'O',
            wins: 0,
            isCpu: false,
          };
          component.outcome = outcome;

          // Act & Assert
          expect(component.selectPlayer1).toBe(expected);
          // Also verify isResult is working as expected
          expect(component.isResult).toBe(outcome !== OutcomeEnum.None);
        }
      );
    });
  });
});
