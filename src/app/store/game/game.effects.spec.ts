import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, toArray, firstValueFrom } from 'rxjs';
import { GameEffects } from './game.effects';
import { startGame } from './game.actions';
import { setCpuPlayer } from '../player/player.actions';
import { GameState } from './game.reducer';
import { PlayerState } from '../player/player.reducer';
import { getInitialGameStateMock } from '../mocks/game-mocks';
import { getInitialPlayerStateMock } from '../mocks/player-mocks';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { selectGameMode } from './game.selectors';
import { RoundActions } from '../round/round.actions';
import { RoundState } from '../round/round.reducer';
import { getInitialRoundStateMock } from '../mocks/round-mocks';
import { selectPlayers } from '../player/player.selectors';

describe('GameEffects', () => {
  let actions$: Observable<any>;
  let effects: GameEffects;
  let mockStore: MockStore;
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let initialRoundStateMock: RoundState;

  beforeEach(() => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
    initialRoundStateMock = getInitialRoundStateMock();

    TestBed.configureTestingModule({
      providers: [
        GameEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            game: initialGameStateMock,
            player: initialPlayerStateMock,
            round: initialRoundStateMock,
          },
        }),
      ],
    });

    effects = TestBed.inject(GameEffects);
    mockStore = TestBed.inject(MockStore);
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  test('should only dispatch startRound action for two player game mode', async () => {
    const action = startGame({ gameMode: GameModeEnum.TwoPlayer });
    actions$ = of(action);

    const result = await firstValueFrom(effects.startGame$);
    expect(result).toStrictEqual(RoundActions.initializeRound());
  });

  test('should dispatch setCpuPlayer and startRound actions for single player game mode', async () => {
    const action = startGame({ gameMode: GameModeEnum.SinglePlayer });
    mockStore.overrideSelector(selectGameMode, GameModeEnum.SinglePlayer);
    mockStore.overrideSelector(selectPlayers, initialPlayerStateMock.players);
    actions$ = of(action);

    const results = await firstValueFrom(effects.startGame$.pipe(toArray()));
    expect(results).toStrictEqual([
      setCpuPlayer({ gamePiece: initialPlayerStateMock.players[1].piece }),
      RoundActions.initializeRound(),
    ]);
  });
});
