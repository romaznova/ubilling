import { Button, Card, Portal, Title, TextInput, Text, Snackbar }  from 'react-native-paper';
import { Picker, TouchableOpacity, View, Modal } from 'react-native';
import React from 'react';
import qs from 'qs';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import PropTypes from 'prop-types';

const requestTimeout = 10000;

export class AddCash extends React.Component {
    state = {
        newcash: '',
        cashtype: 0,
        newpaymentnote: '',
        snackbarVisible: false
    }

    setUserBalance(userLogin) {
        const { mainUrl } =  this.props;
        const data = qs.stringify({newcash: this.state.newcash, cashtype: this.state.cashtype, newpaymentnote: ''});
        axios.post(`${mainUrl}/?module=android&&action=addcash&username=${userLogin}`, data, {timeout: requestTimeout})
            .then(res => {
                if (res.data && res.data.success) {
                    console.log({res});
                    this.setState({snackbarVisible: true});
                }
            })
            .catch(cashErr => {console.log({cashErr});});
    }

    _renderCashTypesList() {
        const { cashTypes } = this.props;
        const array = [];
        _.forIn(cashTypes, (value, index) => {
            array.push({index, value});
        });
        return _.map(_.sortBy(array, e => e.value), (element) => (<Picker.Item key={element.index} label={element.value} value={element.index} />));
    }

    render() {
        const { visible, _closeModal, userLogin, cash, realname } = this.props;
        return (
            <Portal>
                <Modal visible={visible} animationType='slide' onRequestClose={_closeModal} style={{flex: 1}}>
                    <Card style={{flex: 1, padding: 5, position: 'relative', borderRadius: 0}}>
                        <Card.Content style={{flex: 1}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4, marginBottom: 4,  borderBottomWidth: 2, borderBottomColor: 'rgba(81, 138, 201, 1)'}}>
                                <TouchableOpacity style={{width: 22}}
                                    onPress={_closeModal}
                                >
                                    <Icon name='reply' size={22} color='rgba(81, 138, 201, 1)'/>
                                </TouchableOpacity>
                                <Title style={{color: 'rgba(81, 138, 201, 1)'}}>Пополнить счёт</Title>
                                <Icon name='money' size={35} color='rgba(81, 138, 201, 1)'/>
                            </View>
                            <Text style={{fontSize: 15, padding: 5}}>
                                {realname}
                            </Text>
                            <Text style={{fontSize: 14, padding: 5}}>
                                Баланс: ₴ {~~cash}
                            </Text>
                            <Picker
                                selectedValue={this.state.cashtype}
                                mode='dropdown'
                                enabled={true}
                                onValueChange={(itemValue) => {
                                    this.setState({cashtype: itemValue});
                                }}>
                                {this._renderCashTypesList()}
                            </Picker>
                            <TextInput style={{marginBottom: 10}} placeholder='Введите сумму' value={this.state.newcash} onChangeText={value => this.setState({newcash: value.replace(/\D/g, '')})}/>
                            <TextInput style={{marginBottom: 10}} placeholder='Введите комментарий' value={this.state.newpaymentnote} onChangeText={value => this.setState({newpaymentnote: value})}/>
                            <TouchableOpacity style={{height: 50}}  onPress={() => this.setUserBalance(userLogin)}
                            >
                                <Button mode='contained' disabled={!~~this.state.newcash} dark={true}>ПОПОЛНИТЬ</Button>
                            </TouchableOpacity>
                            <Snackbar visible={this.state.snackbarVisible} onDismiss={() => this.setState({snackbarVisible: false})}>
                                Счёт успешно пополнен
                            </Snackbar>
                        </Card.Content>
                    </Card>
                </Modal>
            </Portal>
        );
    }
}

AddCash.propTypes = {
    mainUrl: PropTypes.string,
    cash: PropTypes.string,
    realname: PropTypes.string,
    cashTypes: PropTypes.object,
    visible: PropTypes.bool,
    _closeModal: PropTypes.func,
    userLogin: PropTypes.string
};
