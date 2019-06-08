import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import { MainScreen } from '../MainScreen';
import { AllTasksScreen } from '../AllTasksScreen';
import { SearchScreen } from '../SearchScreen';
import { MailScreen } from '../MailScreen';
import { OptionsScreen } from '../OptionsScreen';
import {Image, ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import { ExitButton } from '../../containers/ExitButton';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import i18n from '../../services/i18n';
import _ from 'lodash';

const updateNavigationLocalization = items => _.forEach(items, element => {
    if (element.options && element.options.locale === i18n.locale) return;
    if (!element.options.localized) {
        element.options.i18nTitle = element.options.title;
        element.options.localized = true;
    }
    element.options.title = i18n.t(element.options.i18nTitle);
    element.options.locale = i18n.locale;
});

export let DrawerNavigator = createDrawerNavigator({
    UserTasks: {
        screen: MainScreen
    },
    AllTasks: {
        screen: AllTasksScreen
    },
    SearchCustomer: {
        screen: SearchScreen
    },
    Messages: {
        screen: MailScreen
    },
    Settings: {
        screen: OptionsScreen
    }
}, {
    contentComponent: props =>
    {
        updateNavigationLocalization(props.descriptors);
        return (
            <View style={styles.fullSpace}>
                <ImageBackground resizeMode='cover'
                    source={require('../../images/drawer-bg.png')}
                    style={styles.fullSpace}>
                    <View style={[styles.fullSpace, styles.drawerContainer]}>
                        <View style={[styles.fullSpace, styles.navigationContainer]}>
                            <View style={styles.header}>
                                <View style={styles.logoContainer}>
                                    <Image style={{width: 240, height: 160}} resizeMode='contain' source={require('../../images/header-img-unicorn.png')} />
                                </View>
                            </View>
                            <ScrollView style={styles.fullSpace}>
                                <DrawerItems {...props}
                                    activeTintColor='rgba(81, 138, 201, 1)'
                                    activeBackgroundColor='rgba(81, 138, 201, 0.4)'
                                    inactiveTintColor='rgba(81, 138, 201, 0.75)'
                                    inactiveBackgroundColor='transparent'
                                    labelStyle={styles.drawerItemLabel}
                                    itemStyle={styles.drawerItem}
                                />
                            </ScrollView>
                        </View>
                        <ExitButton/>
                    </View>
                </ImageBackground>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    fullSpace: {
        flex: 1
    },
    drawerContainer: {
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.7)'
    },
    navigationContainer: {
        backgroundColor: 'transparent',
        position: 'relative'
    },
    header: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        height: 170,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    drawerItem: {
        height: 35,
        margin: 5,
        borderRadius: 0,
        backgroundColor: '#ebedec',
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: {width: 1, height: 2},
        shadowRadius: 2,
        elevation: 2,
    },
    drawerItemLabel: {
        fontSize: 14,
        marginLeft: 0
    }
});


DrawerNavigator = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(DrawerNavigator);
