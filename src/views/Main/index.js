import React from 'react';
import { connect } from 'react-redux';
import { UserLogInForm } from '../LogIn';
import { MainApp } from '../MainApp';
import 'moment/locale/uk';
import 'moment/locale/ru';
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';
import {setLang as setLanguage} from '../../services/i18n';
import {setLang} from '../../actions/localization';

const storage = '@UbillingStorage';

export class Main extends React.Component {
    _initLang () {
        this._getLang();
    }

    _getLang() {
        const { dispatch } = this.props;
        AsyncStorage.getItem(`${storage}:language`, (err, result) => {
            result =  JSON.parse(result);
            if (result && result.language) {
                dispatch(setLang(result.language));
                setLanguage(result.language);
            }
        });
    }

    componentWillMount() {
        this._initLang();

    }

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

