import { Text, View, TouchableOpacity } from 'react-native';
import { Logo } from '../../containers/Logo';
import { Button, Switch, TextInput } from 'react-native-paper';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { toggleDebugMode, setLogInName, setLogInPassword } from '../../actions/login';

export class LogInForm extends React.Component{

    state = {
        isFetching: false
    }

    render() {
        const { state, dispatch, sendLogIn } = this.props;
        return (
            <View style={{width: 280}}>
                <Logo/>
                <View>
                    <TextInput label='ВВЕДИТЕ ЛОГИН'
                        mode='outlined'
                        value={state.user.login}
                        onChangeText={e => { dispatch(setLogInName(e)); }}
                        style={{marginBottom: 10, backgroundColor: '#F5FCFF'}}
                    />
                    <TextInput label='ВВЕДИТЕ ПАРОЛЬ'
                        mode='outlined'
                        value={state.user.password}
                        secureTextEntry={true}
                        onChangeText={e => { dispatch(setLogInPassword(e)); }}
                        style={{marginBottom: 10, backgroundColor: '#F5FCFF'}}
                    />
                    <TouchableOpacity onPress={() => { sendLogIn(); }} >
                        <Button mode='contained'
                            dark={true}
                            disabled={!(!!state.user.login && !!state.user.password)}
                        >
                            ВОЙТИ
                        </Button>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30}}>
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

LogInForm = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(LogInForm);
