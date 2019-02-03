import React from 'react';
import {View, Image, ScrollView, ImageBackground, Dimensions, StyleSheet} from 'react-native';
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
            <View style={[styles.fullSpace, {backgroundColor: '#F5FCFF'}]}>
                <Header openDrawer={this.props.navigation.openDrawer}/>
                <ImageBackground style={[styles.fullSpace, {height: Dimensions.get('window').height}]}
                    resizeMode='cover'
                    source={require('../../images/gears-2.jpeg')}>
                    <View style={[styles.fullSpace, {backgroundColor: 'rgba(255,255,255,0.9)'}]}>
                        <Title style={styles.centerText}>Настройки</Title>
                        <ScrollView style={styles.fullSpace}>
                            <UrlOptions/>
                            {/*<Rights rights={state.rights}/>*/}
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fullSpace: {
        flex: 1
    },
    centerText: {
        textAlign: 'center'
    }
});


OptionsScreen = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(OptionsScreen);

OptionsScreen.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};
