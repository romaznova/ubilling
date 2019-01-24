import { View, TouchableOpacity } from 'react-native';
import { Logo } from '../../containers/Logo';
import { Button, TextInput, Switch } from 'react-native-paper';
import { setLogInUrl } from '../../actions/login';
import React from 'react';
import connect from 'react-redux/es/connect/connect';

export class UrlForm extends React.Component{
    constructor(){
        super();
        this.state = {
            urlMethodAvailable: false
        };
    }

    render() {
        const { state, dispatch, sendLogInUrl, setUrlMethod } = this.props;
        return (
            <View style={{width: 280}}>
                <Logo/>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <TextInput disabled={!this.state.urlMethodAvailable}
                        value={state.user.urlMethod}
                        onChangeText={e => {setUrlMethod(e);}}
                        style={{marginBottom: 10, width: 100, height: 44, backgroundColor: '#F5FCFF'}}/>
                    <Switch value={this.state.urlMethodAvailable}
                        theme={{colors: {accent: '#518AC9'}}}
                        onValueChange={() => {this.setState({urlMethodAvailable: !this.state.urlMethodAvailable});}}/>
                </View>
                <View>
                    <TextInput value={state.user.url}
                        label='ВВЕДИИТЕ URL'
                        mode='outlined'
                        onChangeText={e => { dispatch(setLogInUrl(e)); }}
                        style={{marginBottom: 10, backgroundColor: '#F5FCFF'}}
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

UrlForm = connect(
    state => ({ state }),
    dispatch => ({ dispatch })
)(UrlForm);