import React from 'react';
import { View } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';
import { DrawerNavigator } from './DrawerNavigator';
import moment from 'moment';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import {requestTasks} from '../../actions/tasks';
import {requestAllTasks} from '../../actions/allTasks';
import {requestCashTypes} from '../../actions/cashtypes';
import _ from 'lodash';
import {setAdmins, setEmployees} from '../../actions/staff';
import {setAllJobTypes} from '../../actions/jobtypes';

export class MainApp extends React.Component {
    state = {
        snackbarVisible: false
    }

    _init() {
        const { state, dispatch } = this.props;
        const date = moment().format('YYYY-MM-DD');
        dispatch(requestTasks(state, date));
        dispatch(requestAllTasks(state, date, 'all'));
        dispatch(requestCashTypes(state));
        dispatch(setEmployees(state));
        dispatch(setAdmins(state));
        dispatch(setAllJobTypes(state, dispatch));
    }

    _getAllEmployees() {
        const { state, dispatch } = this.props;
        if (!_.keys(state.staff.employees).length) {
            dispatch(setEmployees(state));
        }
    }

    _getAllAdmins() {
        const { state, dispatch } = this.props;
        if (!_.keys(state.staff.admins).length) {
            dispatch(setAdmins(state));
        }
    }

    _getAllJobTypes() {
        const { state, dispatch } = this.props;
        if (!_.keys(state.jobtypes).length) {
            dispatch(setAllJobTypes(state, dispatch));
        }
    }

    componentDidMount() {
        this._init();
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <DrawerNavigator/>
            </View>
        );
    }
}

MainApp = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(MainApp);


MainApp.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};


