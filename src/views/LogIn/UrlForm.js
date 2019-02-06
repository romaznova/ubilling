import {View, TouchableOpacity, StyleSheet, Picker} from 'react-native';
import { Logo } from '../../containers/Logo';
import { Button, TextInput, Text } from 'react-native-paper';
import { setLogInUrl } from '../../actions/login';
import React from 'react';
import connect from 'react-redux/es/connect/connect';

export class UrlForm extends React.Component {
    render() {
        const { state, dispatch, sendLogInUrl, setUrlMethod } = this.props;
        return (
            <View style={styles.container}>
                <Logo/>
                <View style={styles.urlMethod}>
                    <Picker selectedValue={state.user.urlMethod}
                            onValueChange={itemValue =>
                                setUrlMethod(itemValue)
                            }
                            mode='dropdown'
                            enabled={true}
                            style={{width: 120, height: 50}}
                    >
                        <Picker.Item label='http://' value='http://' />
                        <Picker.Item label='https://' value='https://' />
                    </Picker>
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
