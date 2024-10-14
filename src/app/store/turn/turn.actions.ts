import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';

const startTurn = createAction('Start Turn');
const endTurn = createAction('End Turn');
