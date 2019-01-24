import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

export const REQUEST_UNDONE_TASKS = 'REQUEST_UNDONE_TASKS';
export const RESPONSE_UNDONE_TASKS = 'RESPONSE_UNDONE_TASKS';
export const SET_UNDONE_TASKS = 'SET_UNDONE_TASKS';

export const setUndoneTasks = state => dispatch => {
    dispatch({type: REQUEST_UNDONE_TASKS});
    axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&action=taskmanundone`)
        .then(res => {
            if (res.data && res.data.data) {
                dispatch(setUndoneTasksForToday(state, res.data.data));
                dispatch({type: RESPONSE_UNDONE_TASKS});
            }
        })
        .catch(err => {dispatch({type: RESPONSE_UNDONE_TASKS});console.log({getUndoneTasksError: err});});
};

export const setUndoneTasksForToday = (state, array) => dispatch => {
    axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&action=taskmanundone&date=${moment().format('YYYY-MM-DD')}`)
        .then(res => {
            if (res.data && res.data.data) {
                dispatch({type: SET_UNDONE_TASKS, payload: _.concat(res.data.data, array)});
            }
        })
        .catch(err => {console.log({getUndoneTasksError: err});});
};
