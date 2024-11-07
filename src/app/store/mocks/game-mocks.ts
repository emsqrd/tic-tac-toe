import { GameDifficultyEnum } from '../../enums/game-difficulty.enum';
import { GameModeEnum } from '../../enums/game-mode.enum';
import { GameState } from '../game/game.reducer';

export const getInitialGameStateMock = (): GameState => ({
  draws: 0,
  gameMode: GameModeEnum.TwoPlayer,
  gameDifficulty: GameDifficultyEnum.Easy,
});
