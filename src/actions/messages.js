import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

export const REQUEST_UNDONE_TASKS = 'REQUEST_UNDONE_TASKS';
export const RESPONSE_UNDONE_TASKS = 'RESPONSE_UNDONE_TASKS';
export const SET_UNDONE_TASKS = 'SET_UNDONE_TASKS';

const requestTimeout = 10000;
export const setUndoneTasks = state => dispatch => {
    dispatch({type: REQUEST_UNDONE_TASKS});
    return axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&action=taskmanundone`, {timeout: requestTimeout})
        .then(res => {
            if (res.data && res.data.data) {
                dispatch(setUndoneTasksForToday(state, res.data.data));
                dispatch({type: RESPONSE_UNDONE_TASKS});
            }
        })
        .catch(err => {dispatch({type: RESPONSE_UNDONE_TASKS});console.log({getUndoneTasksError: err});});
};

export const setUndoneTasksForToday = (state, array) => dispatch => {
    return axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&action=taskmanundone&date=${moment().format('YYYY-MM-DD')}`, {timeout: requestTimeout})
        .then(res => {
            if (res.data && res.data.data) {
                dispatch({type: SET_UNDONE_TASKS, payload: _.unionBy(_.map(res.data.data, elem => elem), array, 'id')});
            }
        })
        .catch(err => {console.log({getUndoneTasksError: err});});
};
