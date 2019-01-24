import React from 'react';
import { AsyncStorage, View } from 'react-native';
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
                <View style={{padding: 2, margin: 5, backgroundColor: '#fff', shadowColor: '#000',
                    shadowOffset: { width: 1, height: 3 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    elevation: 2}}>
                    <View style={{margin: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name='unlock' color='rgba(81, 138, 201, 1)' size={34} style={{margin: 5}} />
                                <TextInput disabled={!this.state.changeUrlMethod}
                                    onChangeText={e => {this._setUrlMethod(e);}}
                                    value={state.user.urlMethod}
                                    style={{flex: 1, margin: 5}}/>
                            </View>
                            <Switch theme={{colors: {accent: '#518AC9'}}}
                                value={this.state.changeUrlMethod}
                                onValueChange={() => {this.setState({changeUrlMethod: !this.state.changeUrlMethod});}}/>
                        </View>
                        {this.state.changeUrlMethod && (
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name='exclamation-circle' color='#a81d20' size={26} />
                                <Text style={{flex: 1, color: '#a81d20', marginLeft: 5}}>Внимание! Изменение этих параметров может повлиять на работу приложения!</Text>
                            </View>
                        )}
                    </View>
                    <View style={{margin: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name='globe' color='rgba(81, 138, 201, 1)' size={34} style={{margin: 5}} />
                                <TextInput disabled={!this.state.changeUrl}
                                    onChangeText={e => this._setUrl(e)}
                                    value={state.user.url}
                                    style={{flex: 1, margin: 5}}/>
                            </View>
                            <Switch theme={{colors: {accent: '#518AC9'}}}
                                value={this.state.changeUrl}
                                onValueChange={() => {this.setState({changeUrl: !this.state.changeUrl});}}/>
                        </View>
                        {this.state.changeUrl && (
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name='exclamation-circle' color='#a81d20' size={26} />
                                <Text style={{flex: 1, color: '#a81d20', marginLeft: 5}}>Внимание! Изменение этих параметров может повлиять на работу приложения!</Text>
                            </View>
                        )}
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, margin: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon name='bug' color='rgba(81, 138, 201, 1)' size={34} style={{margin: 5}} />
                            <Text style={{margin: 5}}>РЕЖИМ ОТЛАДКИ</Text>
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

UrlOptions = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(UrlOptions);

UrlOptions.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};
