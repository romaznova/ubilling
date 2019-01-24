import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import { MainScreen } from '../MainScreen';
import { AllTasksScreen } from '../AllTasksScreen';
import { SearchScreen } from '../SearchScreen';
import { MailScreen } from '../MailScreen';
import { OptionsScreen } from '../OptionsScreen';
import { Image, ImageBackground, ScrollView, View } from 'react-native';
import { ExitButton } from '../../containers/ExitButton';
import React from 'react';
import connect from 'react-redux/es/connect/connect';

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
        return <View style={{flex: 1}}>
            <ImageBackground resizeMode='cover'
                source={require('../../images/drawer-bg.png')}
                style={{flex: 1}}>
                <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.7)'}}>
                    <View style={{flex: 1, backgroundColor: 'transparent', position: 'relative'}}>
                        <View style={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            height: 170,
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                                <Image style={{width: 240}} resizeMode='contain' source={require('../../images/Ubilling_logo.png')} />
                            </View>
                        </View>
                        <ScrollView style={{flex: 1}}>
                            <DrawerItems {...props}
                                activeTintColor='rgba(81, 138, 201, 1)'
                                activeBackgroundColor='rgba(81, 138, 201, 0.4)'
                                inactiveTintColor='rgba(81, 138, 201, 0.75)'
                                inactiveBackgroundColor='transparent'
                                labelStyle={{
                                    fontSize: 14,
                                    marginLeft: 0
                                }}
                                itemStyle={{
                                    height: 35,
                                    margin: 5,
                                    borderRadius: 0,
                                    backgroundColor: '#ebedec',
                                    shadowColor: 'rgba(0,0,0,0.2)',
                                    shadowOffset: {
                                        width: 1,
                                        height: 2,
                                    },
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                            />
                        </ScrollView>
                    </View>
                    <ExitButton/>
                </View>
            </ImageBackground>
        </View>;
    }
});

DrawerNavigator = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(DrawerNavigator);
