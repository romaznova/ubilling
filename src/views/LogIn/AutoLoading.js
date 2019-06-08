import React from 'react';
import { finishAutoLoading, startAutoLoading, setLogInUrl, setUrlMethod } from '../../actions/login';
import { AsyncStorage, Text, View } from 'react-native';
import connect from 'react-redux/es/connect/connect';
import { Logo } from '../../containers/Logo';
import { Preloader } from '../../containers/Preloader';
import i18n from '../../services/i18n';

export class AutoLoading extends React.Component {

    componentDidMount() {
        const { state, dispatch } = this.props;
        this._getUrl();
        !state.autoLoading.loadingStarted ? dispatch(startAutoLoading()) : null;
    }

    _getUrl() {
        const { dispatch, sendLogInUrl, storage } = this.props;
        AsyncStorage.getItem(storage, (err, result) => {
            if (result) {
                result =  JSON.parse(result);
                if (result.urlMethod && result.urlMethod.length) {
                    dispatch(setUrlMethod(result.urlMethod));
                }
                if (result.url && result.url.length) {
                    dispatch(setLogInUrl(result.url));
                    sendLogInUrl();
                } else dispatch(finishAutoLoading());
            } else {
                console.log(err);
                dispatch(finishAutoLoading());
            }
        });
    }

    render() {
        return (
            <View style={{justifyContent: 'center'}}>
                <Logo/>
                <Preloader text={i18n.t('preloader')}/>
            </View>
        );
    }
}

AutoLoading = connect(
    state => ({ state }),
    dispatch => ({ dispatch })
)(AutoLoading);
