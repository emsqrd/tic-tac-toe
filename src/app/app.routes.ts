import { Routes } from '@angular/router';
import { GameBoardComponent } from './components/game/game.component';

export const routes: Routes = [
  { path: '', component: GameBoardComponent, pathMatch: 'full' },
  { path: 'gameboard', component: GameBoardComponent, pathMatch: 'full' },
];
