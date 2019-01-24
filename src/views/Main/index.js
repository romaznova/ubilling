import React from 'react';
import { connect } from 'react-redux';
import { UserLogInForm } from '../LogIn';
import { MainApp } from '../MainApp';
import 'moment/locale/ru';
import PropTypes from 'prop-types';

export class Main extends React.Component {
    render () {
        const { state } = this.props;
        return state.user.loggedIn
            ? (<MainApp/>)
            : (<UserLogInForm/>);
    }
}

Main = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(Main);

Main.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};

