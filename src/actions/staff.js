import axios from 'axios';

export const GET_ALL_EMPLOYEES = 'GET_ALL_EMPLOYEES';
export const GET_ALL_ADMINS = 'GET_ALL_ADMINS';

export const setEmployees = state => dispatch => {
    axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&action=emploees`)
        .then(res => {
            if (res.data && res.data.data) {
                dispatch({type: GET_ALL_EMPLOYEES, payload: res.data.data});
            }
        })
        .catch(err => {console.log({getAllEmployeesError: err});});
};

export const setAdmins = state => dispatch => {
    axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&action=admins`)
        .then(res => {
            if (res.data && res.data.data) {
                dispatch({type: GET_ALL_ADMINS, payload: res.data.data});
            }
        })
        .catch(err => {console.log({getAllAdminsError: err});});
};

