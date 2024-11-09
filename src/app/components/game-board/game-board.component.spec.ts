import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { GameBoardComponent } from './game-board.component';
import { SquareComponent } from '../square/square.component';
import { ScoringComponent } from '../scoring/scoring.component';
import { selectDraws } from '../../store/game/game.selectors';
import {
  resetDraws,
  startGame,
  switchGameDifficulty,
  switchGameMode,
} from '../../store/game/game.actions';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { OutcomeEnum } from '../../enums/outcome.enum';
import {
  selectCurrentPlayer,
  selectPlayers,
} from '../../store/player/player.selectors';
import { resetPlayers, switchPlayer } from '../../store/player/player.actions';
import { GameState } from '../../store/game/game.reducer';
import { PlayerState } from '../../store/player/player.reducer';
import { getInitialPlayerStateMock } from '../../store/mocks/player-mocks';
import { getInitialGameStateMock } from '../../store/mocks/game-mocks';
import {
  selectGameBoard,
  selectOutcome,
} from '../../store/round/round.selectors';
import { RoundState } from '../../store/round/round.reducer';
import { getInitialRoundStateMock } from '../../store/mocks/round-mocks';
import { RoundActions } from '../../store/round/round.actions';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { Player } from '../../models/player';
import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;
  let initialGameStateMock: GameState;
  let initialPlayerStateMock: PlayerState;
  let initialRoundStateMock: RoundState;
  let currentPlayerMock: Player;

  beforeEach(async () => {
    initialGameStateMock = getInitialGameStateMock();
    initialPlayerStateMock = getInitialPlayerStateMock();
    initialRoundStateMock = getInitialRoundStateMock();

    await TestBed.configureTestingModule({
      imports: [GameBoardComponent, SquareComponent, ScoringComponent],
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

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();

    currentPlayerMock =
      initialPlayerStateMock.players[initialPlayerStateMock.currentPlayerIndex];

    store.overrideSelector(selectGameBoard, initialRoundStateMock.gameBoard);
    store.overrideSelector(selectOutcome, initialRoundStateMock.outcome);
    store.overrideSelector(selectCurrentPlayer, currentPlayerMock);

    // selectors used by scoring component
    store.overrideSelector(selectPlayers, initialPlayerStateMock.players);
    store.overrideSelector(selectDraws, initialGameStateMock.draws);

    // Reset the state before each test
    store.setState({
      game: initialGameStateMock,
      player: initialPlayerStateMock,
      round: initialRoundStateMock,
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any resources or subscriptions
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch attemptMove action when a square is clicked and there is no outcome', () => {
    component.outcome = OutcomeEnum.None;

    const squareDebugElement: DebugElement = fixture.debugElement.query(
      By.css('t3-square')
    );
    squareDebugElement.triggerEventHandler('click', null);

    expect(dispatchSpy).toHaveBeenCalledWith(
      RoundActions.attemptMove({ position: 0 })
    );
  });

  it('should not dispatch attemptMove action when a square is clicked that is already taken', () => {});

  it('should dispatch startGame and swtichPlayer actions when a square is clicked and the outcome is not None', () => {
    component.outcome = OutcomeEnum.Win;

    const squareDebugElement: DebugElement = fixture.debugElement.query(
      By.css('t3-square')
    );
    squareDebugElement.triggerEventHandler('click', null);

    expect(dispatchSpy).toHaveBeenCalledWith(
      startGame({ gameMode: initialGameStateMock.gameMode })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(switchPlayer());
  });

  it('should return true when the outcome is a draw', () => {
    component.outcome = OutcomeEnum.Draw;
    expect(component.isDraw).toBeTrue();
  });

  it('should return false when the outcome is not a draw', () => {
    component.outcome = OutcomeEnum.Win;
    expect(component.isDraw).toBeFalse();
  });

  it('should switch the game mode and start a new game when game mode button is clicked', () => {
    const gameModeButtonDebugElement: DebugElement = fixture.debugElement.query(
      By.css('#btnGameMode')
    );
    gameModeButtonDebugElement.triggerEventHandler('click', null);

    expect(dispatchSpy).toHaveBeenCalledWith(switchGameMode());
    expect(dispatchSpy).toHaveBeenCalledWith(
      startGame({ gameMode: component.gameMode })
    );
  });

  it('should display the switch difficulty button when the game mode is single player', () => {
    component.gameMode = GameModeEnum.SinglePlayer;
    fixture.detectChanges();

    const gameDifficultyButtonDebugElement: DebugElement =
      fixture.debugElement.query(By.css('#btnGameDifficulty'));

    expect(gameDifficultyButtonDebugElement).toBeTruthy();
  });

  it('should not display the switch difficulty button when the game mode is two player', () => {
    component.gameMode = GameModeEnum.TwoPlayer;
    fixture.detectChanges();

    const gameDifficultyButtonDebugElement: DebugElement =
      fixture.debugElement.query(By.css('#btnGameDifficulty'));

    expect(gameDifficultyButtonDebugElement).toBeFalsy();
  });

  it('should switch the game difficulty and start a new game when game difficulty button is clicked', () => {
    component.gameMode = GameModeEnum.SinglePlayer;
    fixture.detectChanges();

    const gameDifficultyButtonDebugElement: DebugElement =
      fixture.debugElement.query(By.css('#btnGameDifficulty'));
    gameDifficultyButtonDebugElement.triggerEventHandler('click', null);

    expect(dispatchSpy).toHaveBeenCalledWith(switchGameDifficulty());
    expect(dispatchSpy).toHaveBeenCalledWith(
      startGame({ gameMode: component.gameMode })
    );
  });

  it('should reset players and draw count when resetGame is called', () => {
    component.resetGame();

    expect(dispatchSpy).toHaveBeenCalledWith(resetPlayers());
    expect(dispatchSpy).toHaveBeenCalledWith(resetDraws());
  });

  it('should reset the game and start a new game when startNewGame is called', () => {
    spyOn(component, 'resetGame').and.callThrough();

    component.startNewGame();

    expect(component.resetGame).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(
      startGame({ gameMode: component.gameMode })
    );
  });

  it('should show the coming soon message when the game mode is not easy', () => {
    component.gameDifficulty = GameDifficultyEnum.Medium;
    expect(component.showComingSoon).toBeTrue();
  });

  it('should not show the coming soon message when the game mode is easy', () => {
    component.gameDifficulty = GameDifficultyEnum.Easy;
    expect(component.showComingSoon).toBeFalse();
  });

  it('should display the correct game mode button text', () => {
    component.gameMode = GameModeEnum.TwoPlayer;
    expect(component.gameModeButtonText).toBe(GameModeEnum.TwoPlayer.valueOf());

    component.gameMode = GameModeEnum.SinglePlayer;
    expect(component.gameModeButtonText).toBe(
      GameModeEnum.SinglePlayer.valueOf()
    );
  });
});
