import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, toArray } from 'rxjs';
import { GameEffects } from './game.effects';
import { GameService } from '../../services/game.service';
import { startGame } from './game.actions';
import { setCpuPlayer } from '../player/player.actions';
import { GameState } from './game.reducer';
import { PlayerState } from '../player/player.reducer';
import { Player } from '../../models/player';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { selectGameMode } from './game.selectors';
import { RoundActions } from '../round/round.actions';

describe('GameEffects', () => {
  let actions$: Observable<any>;
  let effects: GameEffects;
  let gameService: jasmine.SpyObj<GameService>;
  let mockStore: MockStore;
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let currentPlayerMock: Player;

  beforeEach(() => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();

    TestBed.configureTestingModule({
      providers: [
        GameEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            game: initialGameStateMock,
            player: initialPlayerStateMock,
          },
        }),
        { provide: GameService, useValue: gameService },
      ],
    });

    effects = TestBed.inject(GameEffects);
    mockStore = TestBed.inject(MockStore);

    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];

    // Reset the state before each test
    mockStore.setState({
      game: initialGameStateMock,
      player: initialPlayerStateMock,
    });
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('should dispatch only startRound action if starting a new game not in single player game mode', (done) => {
    const action = startGame({ gameMode: GameModeEnum.TwoPlayer });

    actions$ = of(action);

    effects.startGame$.subscribe((result) => {
      expect(result).toEqual(RoundActions.startRound());
      done();
    });
  });

  it('should dispatch setCpuPlayer action if starting a new game in single player game mode', (done) => {
    const singlePlayerMode = GameModeEnum.SinglePlayer;

    const action = startGame({ gameMode: singlePlayerMode });

    mockStore.overrideSelector(selectGameMode, singlePlayerMode);

    actions$ = of(action);

    // Expect the effect to dispatch multiple actions
    effects.startGame$.pipe(toArray()).subscribe((results) => {
      expect(results).toEqual([
        setCpuPlayer({ gamePiece: 'O' }),
        RoundActions.startRound(),
      ]);
      done();
    });
  });
});
