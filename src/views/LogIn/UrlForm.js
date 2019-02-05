import {View, TouchableOpacity, StyleSheet} from 'react-native';
import { Logo } from '../../containers/Logo';
import { Button, TextInput, Switch } from 'react-native-paper';
import { setLogInUrl } from '../../actions/login';
import React from 'react';
import connect from 'react-redux/es/connect/connect';

export class UrlForm extends React.Component {

    state = {
        urlMethodAvailable: false
    }

    render() {
        const { state, dispatch, sendLogInUrl, setUrlMethod } = this.props;
        return (
            <View style={styles.container}>
                <Logo/>
                <View style={styles.urlMethod}>
                    <TextInput disabled={!this.state.urlMethodAvailable}
                        value={state.user.urlMethod}
                        onChangeText={e => {setUrlMethod(e);}}
                        style={[styles.input, styles.urlMethodInput, styles.background]}/>
                    <Switch value={this.state.urlMethodAvailable}
                        theme={{colors: {accent: '#518AC9'}}}
                        onValueChange={() => {this.setState({urlMethodAvailable: !this.state.urlMethodAvailable});}}/>
                </View>
                <View>
                    <TextInput value={state.user.url}
                        label='ВВЕДИИТЕ URL'
                        mode='outlined'
                        onChangeText={e => { dispatch(setLogInUrl(e)); }}
                        style={[styles.input, styles.background]}
                    />
                    <TouchableOpacity onPress={ () => { sendLogInUrl(); }}>
                        <Button disabled={!state.user.url}
                            mode='contained'
                            dark={true}
                        >
                            ПОДТВЕРДИТЬ
                        </Button>
                    </TouchableOpacity>
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
    urlMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    urlMethodInput: {
        width: 100,
        height: 44
    },
    container: {
        width: 280
    }
});

UrlForm = connect(
    state => ({ state }),
    dispatch => ({ dispatch })
)(UrlForm);
