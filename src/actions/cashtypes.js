import axios from 'axios';
import { createAction } from 'redux-actions';

export const REQUEST_CASH_TYPES = 'REQUEST_CASH_TYPES';
export const RESPONSE_CASH_TYPES = 'RESPONSE_CASH_TYPES';
export const SET_CASH_TYPES = 'SET_CASH_TYPES';

export const setCashTypes = createAction(SET_CASH_TYPES, payload => payload);

const requestTimeout = 10000;
export const requestCashTypes = state => dispatch => {
    axios.get(`${state.user.urlMethod}${state.user.url}/?module=android&action=getallcashtypes`, {timeout: requestTimeout})
        .then(res => {
            if (res.data && res.data.data) {
                dispatch(setCashTypes(res.data.data));
            }
        })
        .catch(cashTypesErr => {
            console.log({cashTypesErr});
        });
};
