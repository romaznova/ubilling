import React from 'react';
import {AsyncStorage, StyleSheet, View} from 'react-native';
import { Switch, Text, TextInput } from 'react-native-paper';
import connect from 'react-redux/es/connect/connect';
import { setLogInUrl, toggleDebugMode, setUrlMethod } from '../../actions/login';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

export class UrlOptions extends React.Component {
    state = {
        changeUrlMethod: false,
        changeUrl: false
    };

    _setUrlMethod(url) {
        const { dispatch } = this.props;
        AsyncStorage.setItem('@MyAppStorage2', JSON.stringify({urlMethod: url}), err => {
            if (!err) {
                dispatch(setUrlMethod(url));
            }
        });
    }

    _setUrl(url) {
        const { dispatch } = this.props;
        AsyncStorage.setItem('@MyAppStorage2', JSON.stringify({url: url}), err => {
            if (!err) {
                dispatch(setLogInUrl(url));
            }
        });
    }

    render() {
        const { state, dispatch } = this.props;
        return (
            <View>
                <View style={styles.card}>
                    <View style={styles.cardItem}>
                        <View style={styles.spaceBetween}>
                            <View style={[styles.fullSpace, styles.center]}>
                                <Icon name='unlock' color='rgba(81, 138, 201, 1)' size={34} style={styles.regularMargin} />
                                <TextInput disabled={!this.state.changeUrlMethod}
                                    onChangeText={e => {this._setUrlMethod(e);}}
                                    value={state.user.urlMethod}
                                    style={[styles.fullSpace, styles.regularMargin]}/>
                            </View>
                            <Switch theme={{colors: {accent: '#518AC9'}}}
                                value={this.state.changeUrlMethod}
                                onValueChange={() => {this.setState({changeUrlMethod: !this.state.changeUrlMethod});}}/>
                        </View>
                        {this.state.changeUrlMethod && (
                            <View style={styles.center}>
                                <Icon name='exclamation-circle' color='#a81d20' size={26} />
                                <Text style={[styles.fullSpace, {color: '#a81d20', marginLeft: 5}]}>Внимание! Изменение этих параметров может повлиять на работу приложения!</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.spaceBetween}>
                            <View style={[styles.fullSpace, styles.center]}>
                                <Icon name='globe' color='rgba(81, 138, 201, 1)' size={34} style={styles.regularMargin} />
                                <TextInput disabled={!this.state.changeUrl}
                                    onChangeText={e => this._setUrl(e)}
                                    value={state.user.url}
                                    style={[styles.fullSpace, styles.regularMargin]}/>
                            </View>
                            <Switch theme={{colors: {accent: '#518AC9'}}}
                                value={this.state.changeUrl}
                                onValueChange={() => {this.setState({changeUrl: !this.state.changeUrl});}}/>
                        </View>
                        {this.state.changeUrl && (
                            <View style={styles.center}>
                                <Icon name='exclamation-circle' color='#a81d20' size={26} />
                                <Text style={[styles.fullSpace, {color: '#a81d20', marginLeft: 5}]}>Внимание! Изменение этих параметров может повлиять на работу приложения!</Text>
                            </View>
                        )}
                    </View>
                    <View style={[styles.cardItem, styles.spaceBetween, styles.center, {height: 50}]}>
                        <View style={styles.center}>
                            <Icon name='bug' color='rgba(81, 138, 201, 1)' size={34} style={styles.regularMargin} />
                            <Text style={styles.regularMargin}>РЕЖИМ ОТЛАДКИ</Text>
                        </View>
                        <Switch theme={{colors: {accent: '#518AC9'}}}
                            value={state.user.debugMode}
                            onValueChange={() => {dispatch(toggleDebugMode(true));}}/>
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
