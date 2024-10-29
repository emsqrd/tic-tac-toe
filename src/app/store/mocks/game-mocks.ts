import { GameModeEnum } from "../../enums/game-mode.enum";
import { OutcomeEnum } from "../../enums/outcome.enum";
import { GameState } from "../game/game.reducer";

export const getInitialGameStateMock = (): GameState => ({
  gameBoard: Array(9).fill({ gamePiece: "", isWinner: false }),
  outcome: OutcomeEnum.None,
  draws: 0,
  gameMode: GameModeEnum.TwoPlayer,
});
