import React from 'react';
import { BackAndroid, Image, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Text, Portal, Modal, Title, Card, Button} from 'react-native-paper';
import { Logo } from '../Logo';
import i18n from '../../services/i18n';

export class ExitButton extends React.Component {
    state = {
        isModalOpen: false
    }

    render() {
        return(
            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(81, 138, 201, 1)', margin: 5, padding: 5}}
                onPress={() => {this.setState({isModalOpen: true});}}>
                <Icon name='power-off' size={25} color='rgba(255, 255, 255, 0.9)'/>
                <Text style={{fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', margin: 5}}>{i18n.t('exit')}</Text>
                <Portal>
                    <Modal visible={this.state.isModalOpen} animationType='slide' onDismiss={() => {this.setState({isModalOpen: false});}}>
                        <Card style={{margin: 5, alignItems: 'center'}}>
                            <Card.Content>
                                <Logo/>
                                <Title style={{textAlign: 'center'}}>{i18n.t('exitMessage')}</Title>
                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <TouchableOpacity style={{flex: 1, marginLeft: 10}} onPress={() => {BackAndroid.exitApp();}}>
                                        <Button mode='contained' dark={true} style={{backgroundColor: '#00a600'}}>{i18n.t('yes')}</Button>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{flex: 1, marginLeft: 10}} onPress={() => {this.setState({isModalOpen: false});}}>
                                        <Button mode='contained' dark={true} style={{backgroundColor: '#ed6f5b'}}>{i18n.t('no')}</Button>
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
