import React from 'react';
import {AsyncStorage, StyleSheet, View, Picker} from 'react-native';
import { Switch, Text, TextInput } from 'react-native-paper';
import connect from 'react-redux/es/connect/connect';
import { setLogInUrl, toggleDebugMode, setUrlMethod } from '../../actions/login';
import { setLang } from '../../actions/localization';
import Icon from 'react-native-vector-icons/FontAwesome';
import {setLangToStorage} from '../../actions/localization';
import PropTypes from 'prop-types';
import moment from 'moment';
import i18n from '../../services/i18n';

const storage = '@UbillingStorage';

export class UrlOptions extends React.Component {
    state = {
        changeUrlMethod: false,
        changeUrl: false,
        url: ''
    };

    _setUrlMethod(url) {
        const { dispatch } = this.props;
        AsyncStorage.setItem(`${storage}:urlMethod`, JSON.stringify({urlMethod: url}), err => {
            if (!err) {
                dispatch(setUrlMethod(url));
            }
        });
    }

    _setUrl(url) {
        const { dispatch } = this.props;
        AsyncStorage.setItem(`${storage}:url`, JSON.stringify({url: url}), err => {
            if (!err) {
                dispatch(setLogInUrl(url));
            }
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

    _changeUrl() {
        if (this.state.changeUrl) {
            this._setUrl(this.state.url);
        }
        this.setState({changeUrl: !this.state.changeUrl});
    }

    componentDidMount() {
        const { state } = this.props;
        this.setState({url: state.user.url});
    }

    render() {
        const { state, dispatch } = this.props;
        return (
            <View>
                <View>
                    <View style={styles.card}>
                        <View style={styles.spaceBetween}>
                            <View style={[styles.fullSpace, styles.center]}>
                                <Icon name='unlock' color='rgba(81, 138, 201, 1)' size={34} style={styles.regularMargin} />
                                <Picker selectedValue={state.user.urlMethod}
                                        onValueChange={itemValue =>
                                            this._setUrlMethod(itemValue)
                                        }
                                        mode='dropdown'
                                        enabled={this.state.changeUrlMethod}
                                        style={[styles.fullSpace, styles.regularMargin]}
                                >
                                    <Picker.Item label='http://' value='http://' />
                                    <Picker.Item label='https://' value='https://' />
                                </Picker>
                            </View>
                            <Switch theme={{colors: {accent: '#518AC9'}}}
                                value={this.state.changeUrlMethod}
                                onValueChange={() => {this.setState({changeUrlMethod: !this.state.changeUrlMethod});}}/>
                        </View>
                        {this.state.changeUrlMethod && (
                            <View style={styles.center}>
                                <Icon name='exclamation-circle' color='#a81d20' size={26} />
                                <Text style={[styles.fullSpace, {color: '#a81d20', marginLeft: 5}]}>{i18n.t('attention')}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.card}>
                        <View style={styles.spaceBetween}>
                            <View style={[styles.fullSpace, styles.center]}>
                                <Icon name='globe' color='rgba(81, 138, 201, 1)' size={34} style={styles.regularMargin} />
                                <TextInput disabled={!this.state.changeUrl}
                                    onChangeText={e => this.setState({url: e})}
                                    value={this.state.url}
                                    style={[styles.fullSpace, styles.regularMargin]}/>
                            </View>
                            <Switch theme={{colors: {accent: '#518AC9'}}}
                                value={this.state.changeUrl}
                                onValueChange={this._changeUrl.bind(this)}/>
                        </View>
                        {this.state.changeUrl && (
                            <View style={styles.center}>
                                <Icon name='exclamation-circle' color='#a81d20' size={26} />
                                <Text style={[styles.fullSpace, {color: '#a81d20', marginLeft: 5}]}>{i18n.t('attention')}</Text>
                            </View>
                        )}
                    </View>
                    <View style={[styles.card, styles.spaceBetween, styles.center, {height: 50}]}>
                        <View style={styles.center}>
                            <Icon name='bug' color='rgba(81, 138, 201, 1)' size={34} style={styles.regularMargin} />
                            <Text style={styles.regularMargin}>{i18n.t('debugMode')}</Text>
                        </View>
                        <Switch theme={{colors: {accent: '#518AC9'}}}
                            value={state.user.debugMode}
                            onValueChange={() => {dispatch(toggleDebugMode(true));}}/>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.spaceBetween}>
                            <View style={[styles.fullSpace, styles.center]}>
                                <Icon name='language' color='rgba(81, 138, 201, 1)' size={34} style={styles.regularMargin} />
                                <Picker selectedValue={state.user.language}
                                        onValueChange={itemValue =>
                                            this._setLang(itemValue)
                                        }
                                        mode='dropdown'
                                        enabled={true}
                                        style={[styles.fullSpace, styles.regularMargin]}
                                >
                                    <Picker.Item label='Русский' value='ru' />
                                    <Picker.Item label='Українська' value='uk' />
                                    <Picker.Item label='English' value='en' />
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fullSpace: {
        flex: 1
    },
    card: {
        padding: 2,
        margin: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 2
    },
    cardItem: {
        margin: 2,
        padding: 5,
        backgroundColor: 'rgba(81, 138, 201, 0.1)'
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    center: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    regularMargin: {
        margin: 5
    }
});

UrlOptions = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(UrlOptions);

UrlOptions.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};
