import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import { Logo } from '../../containers/Logo';
import { Button, Switch, TextInput } from 'react-native-paper';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import {toggleDebugMode, setLogInName, setLogInPassword, confirmLogInUrl} from '../../actions/login';
import Icon from 'react-native-vector-icons/FontAwesome';

export class LogInForm extends React.Component {

    state = {
        isFetching: false
    }

    render() {
        const { state, dispatch, sendLogIn } = this.props;
        return (
            <View style={styles.container}>
                <Logo/>
                <View>
                    <TextInput label='ВВЕДИТЕ ЛОГИН'
                        mode='outlined'
                        value={state.user.login}
                        onChangeText={e => { dispatch(setLogInName(e)); }}
                        style={[styles.input, styles.background]}
                    />
                    <TextInput label='ВВЕДИТЕ ПАРОЛЬ'
                        mode='outlined'
                        value={state.user.password}
                        secureTextEntry={true}
                        onChangeText={e => { dispatch(setLogInPassword(e)); }}
                        style={[styles.input, styles.background]}
                    />
                    <TouchableOpacity onPress={() => { sendLogIn(); }}
                                      style={styles.input}
                    >
                        <Button mode='contained'
                            dark
                            disabled={!(!!state.user.login && !!state.user.password)}
                        >
                            ВОЙТИ
                        </Button>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { dispatch(confirmLogInUrl(false)); }}>
                        <Button mode='contained' dark>Назад</Button>
                    </TouchableOpacity>
                    <View style={styles.debug}>
                        <Text>РЕЖИМ ОТЛАДКИ</Text>
                        <Switch value={state.user.debugMode}
                            onValueChange={() => { dispatch(toggleDebugMode(!state.payload)); }}
                            theme={{colors: {accent: '#518AC9'}}}
                        />
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
    input: {
        marginBottom: 10
    },
    background: {
        backgroundColor: '#F5FCFF'
    },
    debug: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    container: {
        width: 280
    }
});

LogInForm = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(LogInForm);
