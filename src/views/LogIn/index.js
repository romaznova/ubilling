import React from 'react';
import { View, Text, Image, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import {setUserName, setLogInName, finishAutoLoading, confirmLogInUrl, setUrlMethod} from '../../actions/login';
import { loggedIn } from '../../actions/fetchLoggedIn';
import { UrlForm } from './UrlForm';
import { LogInForm } from './LogInForm';
import { AutoLoading } from './AutoLoading';
import { addRights } from '../../actions/rights';
import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';
import PropTypes from 'prop-types';

const storage = '@MyAppStorage2';

export class UserLogInForm extends React.Component {

    setUrlMethod(e) {
        const { dispatch } = this.props;
        AsyncStorage.setItem(storage, JSON.stringify({urlMethod: e}), err => {
            if (!err) {
                dispatch(setUrlMethod(e));
            }
        });
        this._getUrlMethod();
    }

    _getUrlMethod() {
        const { dispatch } = this.props;
        AsyncStorage.getItem(storage, (err, result) => {
            result =  JSON.parse(result);
            if (result.urlMethod && result.urlMethod.length) {
                dispatch(setUrlMethod(result.urlMethod));
            }
        });
    }

    sendLogInUrl(url) {
        const { state, dispatch } = this.props;
        axios.get(`${state.user.urlMethod}${state.user.url || url}/?module=android`, {timeout: 5000})
            .then(res => {
                AsyncStorage.setItem(storage, JSON.stringify({url: state.user.url}));
                if (res.data && res.data.logged_in) {
                    dispatch(finishAutoLoading());
                    dispatch(setUserName(res.data.admin_name));
                    dispatch(setLogInName(res.data.admin));
                    dispatch(loggedIn(res.data.logged_in));
                    dispatch(confirmLogInUrl(true));
                    dispatch(addRights(res.data.rights));
                } else if(res.data && res.data.success) {
                    dispatch(finishAutoLoading());
                    dispatch(confirmLogInUrl(true));
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Ууупс, что-то пошло не так! Проверьте URL и подключение к интернету');
                dispatch(finishAutoLoading());
            });
    }

    sendLogIn() {
        const { state, dispatch } = this.props;
        const root = state.user;
        const data = _.assign({}, {login_form: 1, username: root.login, password: root.password, debug: root.debugMode});
        axios.post(`${state.user.urlMethod}${root.url}/?module=android`, qs.stringify(data), {timeout: 5000})
            .then(res => {
                if (res.data && res.data.logged_in) {
                    dispatch(setUserName(res.data.admin_name));
                    dispatch(setLogInName(res.data.admin));
                    dispatch(loggedIn(res.data.logged_in));
                    dispatch(addRights(res.data.rights));
                } else alert('Вы не правильно введи логин или пароль!');
            })
            .catch(err => {
                console.error(err);
                alert('Ууупс, что-то пошло не так! Проверьте подключение к интернету');
            });
    }

    render() {
        const { state } = this.props;
        let LogIn;
        if (state.autoLoading.loadingFinished) {
            if (state.user.urlConfirmed) {
                LogIn = <LogInForm sendLogIn={this.sendLogIn.bind(this)}/>;
            } else LogIn = <UrlForm setUrlMethod={this.setUrlMethod.bind(this)} sendLogInUrl={this.sendLogInUrl.bind(this)}/>;
        } else LogIn = <AutoLoading sendLogInUrl={this.sendLogInUrl.bind(this)} storage={storage}/>;

        return (
            <View style={{flex: 1, backgroundColor: '#F5FCFF'}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    {LogIn}
                </View>
            </View>
        );
    }
}

UserLogInForm = connect(
    state => ({ state }),
    dispatch => ({ dispatch })
)(UserLogInForm);


UserLogInForm.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};
