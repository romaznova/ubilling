import { createAction } from 'redux-actions';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

export const REQUEST_ALL_TASKS = 'REQUEST_ALL_TASKS';
export const RESPONSE_ALL_TASKS = 'RESPONSE_ALL_TASKS';
export const SET_ALL_TASKS = 'SET_ALL_TASKS';
export const SET_ALL_TASKS_BY_DATE_INTERVAL = 'SET_ALL_TASKS_BY_DATE_INTERVAL';
export const SET_ALL_DATE_INTERVAL_START = 'SET_ALL_DATE_INTERVAL_START';
export const SET_ALL_DATE_INTERVAL_END = 'SET_ALL_DATE_INTERVAL_END';
export const SET_ALL_TASKS_DATE = 'SET_ALL_TASKS_DATE';
export const SET_ALL_TASKS_SORT = 'SET_ALL_TASKS_SORT';
export const SET_ALL_TASK_BY_DATE = 'SET_ALL_TASK_BY_DATE';

export const setAllTasks = createAction(SET_ALL_TASKS, payload => payload);
export const setAllTasksByDateInterval = createAction(SET_ALL_TASKS_BY_DATE_INTERVAL, payload => payload);
export const setAllDateIntervalStart = createAction(SET_ALL_DATE_INTERVAL_START, payload => payload);
export const setAllDateIntervalEnd = createAction(SET_ALL_DATE_INTERVAL_END, payload => payload);
export const setAllTasksDate = createAction(SET_ALL_TASKS_DATE, payload => payload);
export const setAllTasksSort = createAction(SET_ALL_TASKS_SORT, payload => payload);
export const setAllTaskByDate = createAction(SET_ALL_TASK_BY_DATE, payload => payload);

const requestTimeout = 10000;
const checkAllTasksByDate = (state, data) => {
    if (state.allTasks.tasksByDate.length) {
        return _.unionBy(_.map(state.allTasks.tasksByDate, elem => elem), [data], 'date');
    } else return [data];
};

export const requestAllTasks = (state, date, employee) => dispatch => {
    const employeeID = Number(employee) ? `${Number(employee)}` : 'all';
    const currentDate = moment(date || state.allTasks.date).format('YYYY-MM-DD');
    dispatch({type: REQUEST_ALL_TASKS});
    return axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&action=taskman&date=${currentDate}&emploee=${employeeID}`, {timeout: requestTimeout})
        .then(res => {
            dispatch({type: RESPONSE_ALL_TASKS});
            if (res.data && res.data.data) {
                dispatch(setAllTasks(_.sortBy(res.data.data, [
                    state.allTasks.sort.status && 'status',
                    state.allTasks.sort.time && 'starttime',
                    state.allTasks.sort.address && 'address'
                ])));
                dispatch(setAllTaskByDate(checkAllTasksByDate(state, {date: currentDate, data: res.data.data})));

                if (date) {
                    dispatch(setAllTasksDate(moment(date).format('YYYY-MM-DD')));
                }
            }
        })
        .catch(() => {
            dispatch({type: RESPONSE_ALL_TASKS});
        });
};

export const requestAllTasksByDateInterval = (state, date, employee) => dispatch => {
    const employeeID = Number(employee) ? `${Number(employee)}` : 'all';
    dispatch({type: REQUEST_ALL_TASKS});
    return axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&startdate=${date.start}&enddate=${date.end}&emploee=${employeeID}`, {timeout: requestTimeout})
        .then(res => {
            dispatch({type: RESPONSE_ALL_TASKS});
            if (res.data && res.data.data) {
                dispatch(setAllTasksByDateInterval(_.sortBy(res.data.data, [
                    state.allTasks.sort.status && 'status',
                    state.allTasks.sort.time && 'starttime',
                    state.allTasks.sort.address && 'address'
                ])));
            }
        })
        .catch((err) => {
            console.log({err: err});
            dispatch({type: RESPONSE_ALL_TASKS});
        });
};
