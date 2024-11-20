import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, toArray } from 'rxjs';
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
