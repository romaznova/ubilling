import React from 'react';
import { View, Image, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { Text, List, Button, Title } from 'react-native-paper';
import { UrlOptions } from './UrlOptions';
import Icon from 'react-native-vector-icons/FontAwesome';
import connect from 'react-redux/es/connect/connect';
import { Rights } from './Rights';
import { Header } from '../../components/Header';
import PropTypes from 'prop-types';

export class OptionsScreen extends React.Component {

    static navigationOptions = {
        drawerIcon: (
            <Icon name='sliders' size={22} color='rgba(81, 138, 201, 1)'/>
        ),
        title: 'НАСТРОЙКИ'
    }

    render() {
        const { state } = this.props;
        return(
            <View style={{flex: 1, backgroundColor: '#F5FCFF'}}>
                <Header openDrawer={this.props.navigation.openDrawer}/>
                <ImageBackground style={{flex: 1, height: Dimensions.get('window').height}}
                    resizeMode='cover'
                    source={require('../../images/gears-2.jpeg')}>
                    <View style={{flex: 1, backgroundColor: 'rgba(255,255,255,0.9)'}}>
                        <Title style={{textAlign: 'center'}}>Настройки</Title>
                        <ScrollView style={{flex: 1}}>
                            <UrlOptions/>
                            {/*<Rights rights={state.rights}/>*/}
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

OptionsScreen = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(OptionsScreen);

OptionsScreen.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};
