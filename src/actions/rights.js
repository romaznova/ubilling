import { createAction } from 'redux-actions';

export const ADD_RIGHTS = 'ADD_RIGHTS';
export const addRights = createAction(ADD_RIGHTS, payload => payload);