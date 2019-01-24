import { createAction } from 'redux-actions';

export const SET_LOGIN_URL = 'SET_LOGIN_URL';
export const SET_LOGIN_NAME = 'SET_LOGIN_NAME';
export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_LOGIN_PASSWORD = 'SET_LOGIN_PASSWORD';
export const CONFIRM_LOGIN_URL = 'CONFIRM_LOGIN_URL';
export const DEBUG_MODE = 'DEBUG_MODE';
export const START_AUTO_LOADING = 'START_AUTO_LOADING';
export const FINISH_AUTO_LOADING = 'FINISH_AUTO_LOADING';
export const SET_URL_METHOD = 'SET_URL_METHOD';

export const setLogInUrl = createAction(SET_LOGIN_URL, url => url);
export const setUrlMethod = createAction(SET_URL_METHOD, method => method);
export const setLogInName = createAction(SET_LOGIN_NAME, login => login);
export const setLogInPassword = createAction(SET_LOGIN_PASSWORD, password => password);
export const setUserName = createAction(SET_USER_NAME, username => username);
export const confirmLogInUrl = createAction(CONFIRM_LOGIN_URL, confirm => confirm);
export const toggleDebugMode = createAction(DEBUG_MODE, debug => debug);

export const startAutoLoading = createAction(START_AUTO_LOADING, loading => loading);
export const finishAutoLoading = createAction(FINISH_AUTO_LOADING, loading => loading);