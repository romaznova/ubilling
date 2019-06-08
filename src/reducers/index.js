import { combineReducers } from 'redux';

import { SET_LOGIN_URL, DEBUG_MODE, CONFIRM_LOGIN_URL, SET_LOGIN_NAME, SET_LOGIN_PASSWORD, SET_USER_NAME, START_AUTO_LOADING, FINISH_AUTO_LOADING, SET_URL_METHOD } from '../actions/login';
import { FETCH_LOGGED_IN } from '../actions/fetchLoggedIn';
import { REQUEST_TASKS, RESPONSE_TASKS, SET_TASKS, SET_TASKS_DATE, SET_TASKS_SORT, SET_TASKS_TODAY, SET_TASKS_BY_DATE_INTERVAL, SET_DATE_INTERVAL_START, SET_DATE_INTERVAL_END, SET_TASK_BY_DATE } from '../actions/tasks';
import { REQUEST_ALL_TASKS, RESPONSE_ALL_TASKS, SET_ALL_TASKS, SET_ALL_TASKS_DATE, SET_ALL_TASKS_SORT, SET_ALL_TASKS_BY_DATE_INTERVAL, SET_ALL_DATE_INTERVAL_START, SET_ALL_DATE_INTERVAL_END, SET_ALL_TASK_BY_DATE  } from '../actions/allTasks';
import { GET_ALL_EMPLOYEES, GET_ALL_ADMINS } from '../actions/staff';
import { GET_ALL_JOB_TYPES } from '../actions/jobtypes';
import { REQUEST_UNDONE_TASKS, RESPONSE_UNDONE_TASKS, SET_UNDONE_TASKS } from '../actions/messages';
import { ADD_RIGHTS } from '../actions/rights';
import { SET_CASH_TYPES } from '../actions/cashtypes';
import { SET_LANG } from '../actions/localization';
import {setLang} from '../services/i18n';

const InitialLoginState = {
    url: '',
    urlMethod: 'http://',
    login: '',
    password: '',
    urlConfirmed: false,
    debugMode: false,
    loggedIn: false,
    userName: ''
};

const InitialAutoLoadingState = {
    loadingStarted: false,
    urlConfirmed: false,
    loadingFinished: false
};

function user(state = InitialLoginState, action) {
    switch (action.type) {
    case SET_LOGIN_URL:
        return Object.assign({}, state, {url: action.payload});
    case SET_URL_METHOD:
        return Object.assign({}, state, {urlMethod: action.payload});
    case SET_LOGIN_NAME:
        return Object.assign({}, state, {login: action.payload});
    case SET_LOGIN_PASSWORD:
        return Object.assign({}, state, {password: action.payload});
    case SET_USER_NAME:
        return Object.assign({}, state, {userName: action.payload});
    case CONFIRM_LOGIN_URL:
        return Object.assign({}, state, {urlConfirmed: action.payload});
    case DEBUG_MODE:
        return Object.assign({}, state, {debugMode: !state.debugMode});
    case FETCH_LOGGED_IN:
        return Object.assign({}, state, {loggedIn: action.loggedIn, urlConfirmed: true});
    case SET_LANG:
        setLang(action.payload);
        return Object.assign({}, state, {language: action.payload});
    default:
        return state;
    }
}

function autoLoading(state = InitialAutoLoadingState, action) {
    switch (action.type) {
    case START_AUTO_LOADING:
        return Object.assign({}, state, {loadingStarted: true});
    case FINISH_AUTO_LOADING:
        return Object.assign({}, state, {loadingFinished: true});
    default:
        return state;
    }
}

function userTasks(state = {tasks: [], todayTasks: [], tasksByDateInterval: [], tasksByDate: [], date: undefined, dateInterval: {start: '', end: ''}, sort: {time: false, status: false, address: false}}, action) {
    switch (action.type) {
    case REQUEST_TASKS:
        return Object.assign({}, state, {isFetching: true});
    case RESPONSE_TASKS:
        return Object.assign({}, state, {isFetching: false});
    case SET_TASKS:
        return Object.assign({}, state, {tasks: action.payload, isFetching: false});
    case SET_TASKS_DATE:
        return Object.assign({}, state, {date: action.payload});
    case SET_DATE_INTERVAL_START:
        return Object.assign({}, state, {dateInterval: action.payload});
    case SET_DATE_INTERVAL_END:
        return Object.assign({}, state, {dateInterval: action.payload});
    case SET_TASKS_TODAY:
        return Object.assign({}, state, {todayTasks: action.payload});
    case SET_TASKS_BY_DATE_INTERVAL:
        return Object.assign({}, state, {tasksByDateInterval: action.payload});
    case SET_TASKS_SORT:
        return Object.assign({}, state, {sort: action.payload});
    case SET_TASK_BY_DATE:
        return Object.assign({}, state, {tasksByDate: action.payload});
    default:
        return state;
    }
}

function allTasks(state = {tasks: [], tasksByDateInterval: [], tasksByDate: [], date: '', dateInterval: {start: '', end: ''}, sort: {time: false, status: false, address: false}}, action) {
    switch (action.type) {
    case REQUEST_ALL_TASKS:
        return Object.assign({}, state, {isFetching: true});
    case RESPONSE_ALL_TASKS:
        return Object.assign({}, state, {isFetching: false});
    case SET_ALL_TASKS:
        return Object.assign({}, state, {tasks: action.payload});
    case SET_ALL_DATE_INTERVAL_START:
        return Object.assign({}, state, {dateInterval: action.payload});
    case SET_ALL_DATE_INTERVAL_END:
        return Object.assign({}, state, {dateInterval: action.payload});
    case SET_ALL_TASKS_BY_DATE_INTERVAL:
        return Object.assign({}, state, {tasksByDateInterval: action.payload});
    case SET_ALL_TASKS_DATE:
        return Object.assign({}, state, {date: action.payload});
    case SET_ALL_TASKS_SORT:
        return Object.assign({}, state, {sort: action.payload});
    case SET_ALL_TASK_BY_DATE:
        return Object.assign({}, state, {tasksByDate: action.payload});
    default:
        return state;
    }
}

function staff(state = {employees: {}, admins: {}}, action) {
    switch (action.type) {
    case GET_ALL_EMPLOYEES:
        return Object.assign({}, state, {employees: action.payload});
    case GET_ALL_ADMINS:
        return Object.assign({}, state, {admins: action.payload});
    default:
        return state;
    }
}

function jobTypes(state = {}, action) {
    switch (action.type) {
    case GET_ALL_JOB_TYPES:
        return Object.assign({}, state, action.payload);
    default:
        return state;
    }
}

function messages(state = {undoneTasks: [], isFetching: false}, action) {
    switch (action.type) {
    case REQUEST_UNDONE_TASKS:
        return Object.assign({}, state, {isFetching: true});
    case RESPONSE_UNDONE_TASKS:
        return Object.assign({}, state, {isFetching: false});
    case SET_UNDONE_TASKS:
        return Object.assign({}, state, {undoneTasks: action.payload});
    default:
        return state;
    }
}

function rights(state = {}, action) {
    switch (action.type) {
    case ADD_RIGHTS:
        return Object.assign({}, state, action.payload);
    default:
        return state;
    }
}

function cashTypes(state = {}, action) {
    switch (action.type) {
    case SET_CASH_TYPES:
        return Object.assign({}, state, action.payload);
    default:
        return state;
    }
}

export const store = combineReducers({
    user,
    autoLoading,
    userTasks,
    allTasks,
    staff,
    jobTypes,
    messages,
    rights,
    cashTypes
});
