import React from 'react';
import {View, Text, Image, AsyncStorage, StyleSheet} from 'react-native';
import {FAB, Portal} from 'react-native-paper';
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
import i18n from '../../services/i18n';
import Icon from 'react-native-vector-icons/FontAwesome';
import {setLang} from '../../actions/localization';

const storage = '@UbillingStorage';
const requestTimeout = 10000;

export class UserLogInForm extends React.Component {
    state = {
        isFetching: false,
        open: false
    }

    setUrlMethod(e) {
        const { dispatch } = this.props;
        AsyncStorage.setItem(`${storage}:urlMethod`, JSON.stringify({urlMethod: e}), err => {
            if (!err) {
                dispatch(setUrlMethod(e));
            }
        });
        this._getUrlMethod();
    }

    _getUrlMethod() {
        const { dispatch } = this.props;
        AsyncStorage.getItem(`${storage}:urlMethod`, (err, result) => {
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
                AsyncStorage.setItem(`${storage}:url`, JSON.stringify({url: state.user.url}));
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
                if (this.state.isFetching) {
                    this.setState({isFetching: false});
                }
            })
            .catch((err) => {
                console.log(err);
                dispatch(finishAutoLoading());
                if (this.state.isFetching) {
                    this.setState({isFetching: false});
                }
                alert(i18n.t('login.err'));
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
                } else alert(res.data.message || i18n.t('login.warn'));
                if (this.state.isFetching) {
                    this.setState({isFetching: false});
                }
            })
            .catch(err => {
                console.error(err);
                if (this.state.isFetching) {
                    this.setState({isFetching: false});
                }
                alert(i18n.t('login.err'));
            });
    }

    _setLang(language) {
        const { dispatch } = this.props;
        AsyncStorage.setItem(`${storage}:language`, JSON.stringify({language}), err => {
            if (!err) {
                dispatch(setLang(language));
            }
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
                <Portal>
                    <FAB.Group
                        open={this.state.open}
                        icon='language'
                        actions={[
                            { icon: 'check', label: 'English', onPress: () => this._setLang('en')},
                            { icon: 'check', label: 'Русский', onPress: () => this._setLang('ru') },
                            { icon: 'check', label: 'Українська', onPress: () => this._setLang('uk') },
                        ]}
                        onStateChange={({ open }) => this.setState({ open })}
                        onPress={() => {}}
                    />
                </Portal>
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
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
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
