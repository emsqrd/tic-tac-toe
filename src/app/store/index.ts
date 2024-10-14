import { boardReducer } from './board/board.reducer';
import { gameReducer } from './game/game.reducer';
import { playerReducer } from './player/player.reducer';

export const reducers = {
  game: gameReducer,
  board: boardReducer,
  player: playerReducer,
};
