import { createAction } from 'redux-actions';
import {AsyncStorage} from 'react-native';

export const SET_LANG = 'SET_LANG';
export const GET_LANG = 'GET_LANG';
export const setLang = createAction(SET_LANG, payload => payload);
export const getLang = createAction(GET_LANG, payload => payload);
