import React, { Component } from 'react';
import { Platform } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { store } from './src/reducers';
import { Main } from './src/views/Main';
import thunk from 'redux-thunk';

let myStore = createStore( store, composeWithDevTools(applyMiddleware(thunk)) );
let unsubscribe = myStore.subscribe( () => console.log(myStore.getState()) );
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

export default class App extends Component {
    render() {
        return (
            <Provider store={myStore}>
                <PaperProvider theme={theme}>
                    <Main/>
                </PaperProvider>
            </Provider>
        );
    }
}

const theme = {
    ...DefaultTheme,
    roundness: 6,
    colors: {
        ...DefaultTheme.colors,
        primary: '#518AC9',
        accent: '#F5FCFF'
    }
};

