import React from 'react';
import {View, Text, Image, AsyncStorage, StyleSheet} from 'react-native';
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
const requestTimeout = 10000;

export class UserLogInForm extends React.Component {
    state = {
        isFetching: false
    }

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
        this.setState({isFetching: true});
        axios.get(`${state.user.urlMethod}${state.user.url || url}/?module=android`, {timeout: requestTimeout})
            .then(res => {
                AsyncStorage.setItem(storage, JSON.stringify({url: state.user.url}));
                if (res.data && res.data.logged_in) {
                    dispatch(setUserName(res.data.admin_name));
                    dispatch(setLogInName(res.data.admin));
                    dispatch(loggedIn(res.data.logged_in));
                    dispatch(confirmLogInUrl(true));
                    dispatch(addRights(res.data.rights));
                } else if(res.data && res.data.success) {
                    dispatch(confirmLogInUrl(true));
                }
                dispatch(finishAutoLoading());
                this.setState({isFetching: false});
            })
            .catch((err) => {
                console.log(err);
                alert('Ууупс, что-то пошло не так! Проверьте URL и подключение к интернету');
                dispatch(finishAutoLoading());
                this.setState({isFetching: false});
            });
    }

    sendLogIn() {
        const { state, dispatch } = this.props;
        const root = state.user;
        const data = _.assign({}, {login_form: 1, username: root.login, password: root.password, debug: root.debugMode});
        this.setState({isFetching: true});
        axios.post(`${state.user.urlMethod}${root.url}/?module=android`, qs.stringify(data), {timeout: requestTimeout})
            .then(res => {
                if (res.data && res.data.logged_in) {
                    dispatch(setUserName(res.data.admin_name));
                    dispatch(setLogInName(res.data.admin));
                    dispatch(loggedIn(res.data.logged_in));
                    dispatch(addRights(res.data.rights));
                } else alert(res.data.message || 'Вы не правильно ввели логин или пароль!');
                this.setState({isFetching: true});
            })
            .catch(err => {
                console.error(err);
                this.setState({isFetching: true});
                alert('Ууупс, что-то пошло не так! Проверьте подключение к интернету');
            });
    }

    render() {
        const { state } = this.props;
        let LogIn;
        if (state.autoLoading.loadingFinished) {
            if (state.user.urlConfirmed) {
                LogIn = <LogInForm {...this.state} sendLogIn={this.sendLogIn.bind(this)}/>;
            } else LogIn = <UrlForm {...this.state} setUrlMethod={this.setUrlMethod.bind(this)} sendLogInUrl={this.sendLogInUrl.bind(this)}/>;
        } else LogIn = <AutoLoading sendLogInUrl={this.sendLogInUrl.bind(this)} storage={storage}/>;

        return (
            <View style={[styles.fullSpace, styles.background]}>
                <View style={[styles.fullSpace, styles.center]}>
                    {LogIn}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fullSpace: {
        flex: 1
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    background: {
        backgroundColor: '#F5FCFF'
    }
});

UserLogInForm = connect(
    state => ({ state }),
    dispatch => ({ dispatch })
)(UserLogInForm);


UserLogInForm.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};
