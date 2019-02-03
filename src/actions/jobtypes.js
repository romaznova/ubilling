import axios from 'axios';

export const GET_ALL_JOB_TYPES = 'SET_ALL_JOB_TYPES';

const requestTimeout = 10000;
export const setAllJobTypes = state => dispatch => {
    return axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&action=getalljobtypes`, {timeout: requestTimeout})
        .then(res => {
            if (res.data && res.data.data) {
                dispatch({type: GET_ALL_JOB_TYPES, payload: res.data.data});
            }
        })
        .catch(err => {console.log({getAllJobTypesError: err});});
};
