import React from 'react';
import { BackAndroid, Image, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Portal, Modal, Title, Card } from 'react-native-paper';
import { Logo } from '../Logo';

export class ExitButton extends React.Component {
    state = {
        isModalOpen: false
    }

    render() {
        return(
            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(81, 138, 201, 1)', margin: 5, padding: 5}}
                onPress={() => {this.setState({isModalOpen: true});}}>
                <Icon name='power-off' size={25} color='rgba(255, 255, 255, 0.9)'/>
                <Text style={{fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', margin: 5}}>ВЫЙТИ</Text>
                <Portal>
                    <Modal visible={this.state.isModalOpen} animationType='slide' onDismiss={() => {this.setState({isModalOpen: false});}}>
                        <Card style={{margin: 5, alignItems: 'center'}}>
                            <Card.Content>
                                <Logo/>
                                <Title style={{textAlign: 'center'}}>Вы уверены что хотите закрыть приложение</Title>
                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <TouchableOpacity style={{width: 150, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 5, padding: 10, backgroundColor: 'rgba(81, 138, 201, 1)'}} onPress={() => {BackAndroid.exitApp();}}>
                                        <Icon name='check-circle' size={25} color='rgba(255, 255, 255, 0.9)'/>
                                        <Text style={{fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', marginLeft: 10}}>ОК</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{width: 150, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 5, padding: 10, backgroundColor: '#ed6f5b'}} onPress={() => {this.setState({isModalOpen: false});}}>
                                        <Icon name='times-circle' size={25} color='rgba(255, 255, 255, 0.9)'/>
                                        <Text style={{fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', marginLeft: 10}}>ОТМЕНА</Text>
                                    </TouchableOpacity>
                                </View>
                            </Card.Content>
                        </Card>
                    </Modal>
                </Portal>
            </TouchableOpacity>
        );
    }
}
