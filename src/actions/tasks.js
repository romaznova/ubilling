import { createAction } from 'redux-actions';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

export const REQUEST_TASKS = 'REQUEST_TASKS';
export const RESPONSE_TASKS = 'RESPONSE_TASKS';
export const SET_TASKS = 'SET_TASKS';
export const SET_TASKS_DATE = 'SET_TASKS_DATE';
export const SET_DATE_INTERVAL_START = 'SET_DATE_INTERVAL_START';
export const SET_DATE_INTERVAL_END = 'SET_DATE_INTERVAL_END';
export const SET_TASKS_TODAY = 'SET_TASKS_TODAY';
export const SET_TASKS_BY_DATE_INTERVAL = 'SET_TASKS_BY_DATE_INTERVAL';
export const SET_TASKS_SORT = 'SET_TASKS_SORT';
export const SET_TASK_BY_DATE = 'SET_TASK_BY_DATE';

export const setTasks = createAction(SET_TASKS, payload => payload);
export const setTasksDate = createAction(SET_TASKS_DATE, payload => payload);
export const setTasksToday = createAction(SET_TASKS_TODAY, payload => payload);
export const setTasksByDateInterval = createAction(SET_TASKS_BY_DATE_INTERVAL, payload => payload);
export const setDateIntervalStart = createAction(SET_DATE_INTERVAL_START, payload => payload);
export const setDateIntervalEnd = createAction(SET_DATE_INTERVAL_END, payload => payload);
export const setTasksSort = createAction(SET_TASKS_SORT, payload => payload);
export const setTaskByDate = createAction(SET_TASK_BY_DATE, payload => payload);

const requestTimeout = 10000;
const checkTasksByDate = (state, data) => {
    if (state.userTasks.tasksByDate.length) {
        return _.unionBy(_.map(state.userTasks.tasksByDate, elem => elem), [data], 'date');
    } else return [data];
};

export const requestTasks = (state, date) => dispatch => {
    const sortedTasks = tasks => _.sortBy(tasks, [
        state.userTasks.sort.status && 'status',
        state.userTasks.sort.time && 'starttime',
        state.userTasks.sort.address && 'address'
    ]);

    dispatch({type: REQUEST_TASKS});

    return axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&action=taskman&date=${moment(date || state.userTasks.date).format('YYYY-MM-DD')}`, {timeout: requestTimeout})
        .then(res => {
            dispatch({type: RESPONSE_TASKS});
            if (res.data && res.data.data) {
                // dispatch(setTasks(sortedTasks(res.data.data)));
                dispatch(setTaskByDate(checkTasksByDate(state, {date: moment(date || state.userTasks.date).format('YYYY-MM-DD'), data: sortedTasks(res.data.data)})));
                if (date) {
                    dispatch(setTasksDate(moment(date).format('YYYY-MM-DD')));
                }
                if ((date === moment().format('YYYY-MM-DD'))) {
                    dispatch(setTasksToday(sortedTasks(res.data.data)));
                }
            }
        })
        .catch(() => {
            dispatch({type: RESPONSE_TASKS});
        });
};

export const requestAllTasksByDateInterval = (state, date) => dispatch => {
    dispatch({type: REQUEST_TASKS});
    const sortedTasks = tasks => _.sortBy(tasks, [
        state.userTasks.sort.status && 'status',
        state.userTasks.sort.time && 'starttime',
        state.userTasks.sort.address && 'address'
    ]);
    return axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&startdate=${date.start}&enddate=${date.end}`, {timeout: requestTimeout})
        .then(res => {
            dispatch({type: RESPONSE_TASKS});
            if (res.data && res.data.data) {
                dispatch(setTasksByDateInterval(sortedTasks(res.data.data)));
            }
        })
        .catch(() => {
            dispatch({type: RESPONSE_TASKS});
        });
};

export const modifyTask = (state, data) => dispatch => {
    dispatch({type: REQUEST_TASKS});
    return axios.post(`${state.user.urlMethod}${state.user.url}/?module=android&action=modifytask`, data, {timeout: requestTimeout})
        .then(res => {
            dispatch({type: RESPONSE_TASKS});
            if (res.data && res.data.success) {
                dispatch(requestTasks(state));
            }
        })
        .catch(modifyTaskErr => {
            console.log({modifyTaskErr});
            dispatch({type: RESPONSE_TASKS});
        });
};

export const modifyTaskStatus = (state, data) => dispatch => {
    dispatch({type: REQUEST_TASKS});
    return axios.post(`${state.user.urlMethod}${state.user.url}/?module=android&action=changetask`, data, {timeout: requestTimeout})
        .then(res => {
            dispatch({type: RESPONSE_TASKS});
            if (res.data && res.data.success) {
                dispatch(requestTasks(state));
            }
        })
        .catch(modifyTaskStatusErr => {
            dispatch({type: RESPONSE_TASKS});
            console.log({modifyTaskStatusErr});
        });
};

export const setTaskComment = (state, data) => dispatch => {
    dispatch({type: REQUEST_TASKS});
    return axios.post(`${state.user.urlMethod}${state.user.url}/?module=android&action=newadcommentstext`, data, {timeout: requestTimeout})
        .then(res => {
            dispatch({type: RESPONSE_TASKS});
            if (res.data && res.data.success) {
                dispatch(requestTasks(state));
            }
        })
        .catch(setTaskCommentErr => {
            dispatch({type: RESPONSE_TASKS});
            console.log({setTaskCommentErr});
        });
};
