import { Button, Card, Modal, Portal, Text, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import {Logo} from '../Logo';

export class ChangeAdmin extends React.Component {

    state = {
        isModalOpen: false
    }

    render() {
        const { username, _logOut } = this.props;
        return (
            <TouchableOpacity onPress={() => {this.setState({isModalOpen: true});}} style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: 'rgba(81, 138, 201, 1)', fontSize: 14, marginRight: 10}}>{username}</Text>
                <Icon name='id-card' color='rgba(81, 138, 201, 1)' size={28}/>
                <Portal>
                    <Modal visible={this.state.isModalOpen} onDismiss={() => {this.setState({isModalOpen: false});}}>
                        <Card style={{margin: 10}}>
                            <Card.Content>
                                <Logo/>
                                <Title style={{textAlign: 'center', marginBottom: 20}}>Вы уверены что хотите сменить пользователя?</Title>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity style={{flex: 1, marginRight: 2}} onPress={() => {_logOut();}}>
                                        <Button mode='contained' dark={true} style={{backgroundColor: '#00a600'}}>Да, хочу!</Button>
                                    </TouchableOpacity>
                                    <TouchableOpacity  style={{flex: 1, marginLeft: 2}} onPress={() => {this.setState({isModalOpen: false});}}>
                                        <Button mode='contained' dark={true} style={{backgroundColor: '#ed6f5b'}}>Нет, я ошибся</Button>
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

ChangeAdmin.propTypes = {
    username: PropTypes.string,
    _logOut: PropTypes.func
};
