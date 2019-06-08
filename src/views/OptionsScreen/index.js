import React from 'react';
import {View, Image, ScrollView, ImageBackground, Dimensions, StyleSheet} from 'react-native';
import { Text, List, Button, Title } from 'react-native-paper';
import { UrlOptions } from './UrlOptions';
import Icon from 'react-native-vector-icons/FontAwesome';
import connect from 'react-redux/es/connect/connect';
import { Rights } from './Rights';
import { Header } from '../../components/Header';
import PropTypes from 'prop-types';
import i18n from '../../services/i18n';

export class OptionsScreen extends React.Component {

    static navigationOptions = {
        drawerIcon: (
            <Icon name='sliders' size={22} color='rgba(81, 138, 201, 1)'/>
        ),
        title: 'drawer.settings'
    }

    render() {
        const { state } = this.props;
        return(
            <View style={[styles.fullSpace, {backgroundColor: '#F5FCFF'}]}>
                <Header openDrawer={this.props.navigation.openDrawer}/>
                <View style={[styles.fullSpace]}>
                    <View style={[styles.fullSpace]}>
                        <Title style={styles.centerText}>{i18n.t('settings')}</Title>
                        <ScrollView style={styles.fullSpace}>
                            <UrlOptions/>
                            {/*<Rights rights={state.rights}/>*/}
                        </ScrollView>
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
