import React from 'react';
import {Picker, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Card, Snackbar, Text, TextInput, Title} from 'react-native-paper';
import { ModalCard } from '../../containers/Modal';
import {EditUserDetails} from '../../containers/Modal/EditUserDetails';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import call from 'react-native-phone-call';
import axios from 'axios';
import PropTypes from 'prop-types';
import qs from 'qs';

const requestTimeout = 10000;

export class SearchResultItem extends React.Component {
    state = {
        isModalVisible: false,
        isModalCashVisible: false,
        isModalEditUserVisible: false,
        dhcpLogs: 'Нет данных ...',
        ping: 'Нет данных ...',
        cashtype: '0',
        newcash: '',
        newpaymentnote: '',
        snackbarVisible: false,
        addCashMessage: 'Счёт успешно пополнен',
        properties: {},
        isFetching: false
    };

    _toggleModalVisibility() {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    _toggleModalCashVisibility() {
        this.setState({isModalCashVisible: !this.state.isModalCashVisible});
    }

    _toggleModalEditUserVisibility() {
        this.setState({isModalEditUserVisible: !this.state.isModalEditUserVisible});
    }

    getPhoneNumber(number) {
        if (number && number.length > 2) {
            return _.map(number.split(/\D/g), (element, index) => {
                if (element.length) {
                    return (
                        <TouchableOpacity onPress={() => {call({number: element, prompt: false}).catch(err => {console.warn(err);});}} key={index} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', margin: 5, padding: 10, height: 30, borderRadius: 15, backgroundColor: 'rgba(81, 138, 201, 1)'}}>
                            <Icon name='phone' size={25} color='rgba(255, 255, 255, 0.9)'/>
                            <Text style={{fontSize: 13, fontWeight: '500', marginLeft: 10, color: 'rgba(255, 255, 255, 0.9)'}}>{element}</Text>
                        </TouchableOpacity>
                    );
                } else return null;
            }).filter(el => el != null);
        }
    }

    getDhcpLogs(userLogin) {
        const { mainUrl } =  this.props;
        return axios.get(`${mainUrl}/?module=android&action=pl_dhcp&username=${userLogin}`, {timeout: requestTimeout})
            .then(res => {
                if (res.data.data && res.data.data[userLogin] && res.data.data[userLogin].dhcp) {
                    this.setState({dhcpLogs: res.data.data[userLogin].dhcp});
                } else  this.setState({dhcpLogs: 'Логов нет'});
            })
            .catch(err => {
                console.log({dhcpError: err});
                this.setState({dhcpLogs: 'Не удалось получить данные'});
            });
    }

    getPing(userLogin) {
        const { mainUrl } =  this.props;
        return axios.get(`${mainUrl}/?module=android&&action=pl_pinger&username=${userLogin}`, {timeout: requestTimeout})
            .then(res => {
                this.setState({ping: res.data.data[userLogin].ping});
            })
            .catch(err => {console.log(err);this.setState({ping: 'Не удалось получить данные'});});
    }

    _renderCashTypesList() {
        const { cashTypes } = this.props;
        const array = [];
        _.forIn(cashTypes, (value, index) => {
            array.push({index, value});
        });
        return _.map(_.sortBy(array, e => e.value), element => {return <Picker.Item key={element.index} label={element.value} value={element.index} />});
    }

    setUserBalance(userLogin) {
        const { mainUrl, search } =  this.props;
        const data = {
            newcash: this.state.newcash,
            cashtype: this.state.cashtype,
            newpaymentnote: this.state.newpaymentnote
        };

        return axios.post(`${mainUrl}/?module=android&&action=addcash&username=${userLogin}`, qs.stringify(data), {timeout: requestTimeout})
            .then(res => {
                if (res.data && res.data.success) {
                    this.setState({snackbarVisible: true, newcash: ''}, this._getUserDetails.bind(this));
                } else if (res.data && res.data.message) {
                    this.setState({snackbarVisible: true, addCashMessage: res.data.message, newcash: ''}, this._getUserDetails.bind(this));
                } else this.setState({snackbarVisible: true, addCashMessage: 'Не удалось пополнить счёт', newcash: ''});
            })
            .catch(() => {this.setState({snackbarVisible: true, addCashMessage: 'Ошибка сети', newcash: ''});});
    }

    _getUserDetails(callback) {
        const { mainUrl, element } = this.props;
        const userLogin = element.login;
        return axios.get(`${mainUrl}/?module=android&action=userprofile&username=${userLogin}`, {timeout: requestTimeout})
            .then(res => {
                if (res.data && res.data.data && res.data.data[userLogin]) {
                    this.setState({properties: res.data.data[userLogin], isFetching: false});
                } else this.setState({properties: {'Ошибка':'Не удалось загрузить данные'}, isFetching: false});
                if (callback) {
                    callback();
                }
            })
            .catch((err) => {
                this.setState({properties: {'Ошибка':'Ошибка сети'}, isFetching: false});
                console.log({pingError: err});
                if (callback) {
                    callback();
                }
            });
    }

    componentDidMount() {
        const { element, cashTypes, rights } = this.props;
        if (rights.PLPINGER && rights.PLPINGER.rights) {
            this.getPing(element.login);
        }
        if (rights.PLDHCP && rights.PLDHCP.rights) {
            this.getDhcpLogs(element.login);
        }
        this.setState({cashtype: _.keys(cashTypes)[0]});
        this._getUserDetails();
    }

    render () {
        const { element, index, mainUrl, search, rights } = this.props;
        const editableProperties = _.pick(this.state.properties, ['login', 'Password', 'realname', 'phone', 'mobile', 'email', 'mac', 'Down', 'Passive', 'notes', 'seal', 'length', 'price']);
        return (
            <View style={{margin: 4}}>
                <TouchableOpacity onPress={this._toggleModalVisibility.bind(this)}>
                    <View style={[styles.fullSpace, styles.card]}>
                        <View style={{justifyContent: 'center', alignItems: 'center', width: 30, height: 100, backgroundColor: 'rgba(81, 138, 201, 1)'}}>
                            <Text style={{fontWeight: '500', color: 'rgba(255,255,255,0.9)'}}>{index + 1}</Text>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', marginLeft: 10, marginRight: 10}}>
                            <Text style={{paddingBottom: 5, fontSize: 16, fontWeight: '500'}}>{element.fulladress}</Text>
                            <Text style={{paddingBottom: 5, fontSize: 14}}>{element.realname}</Text>
                            <Text style={{paddingBottom: 5, fontSize: 14}}>Баланс: {this.state.properties.Cash ? `₴ ${parseInt(this.state.properties.Cash)}` : 'Обновляется...' } </Text>
                        </View>
                        <View>
                            {(rights && rights.USEREDIT && rights.USEREDIT.rights) &&
                                <TouchableOpacity onPress={this._toggleModalEditUserVisibility.bind(this)} style={{margin: 5, alignItems: 'center'}}>
                                    <Icon name='edit' size={35} color='rgba(81, 138, 201, 1)'/>
                                </TouchableOpacity>
                            }
                            {(rights && rights.CASH && rights.CASH.rights) &&
                                <TouchableOpacity onPress={this._toggleModalCashVisibility.bind(this)} style={{padding: 5}}>
                                    <Icon name='money' size={35} color='rgba(81, 138, 201, 1)'/>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <ModalCard visible={this.state.isModalVisible} rights={rights} dhcpLogs={this.state.dhcpLogs} ping={this.state.ping} getPing={this.getPing.bind(this)} getDhcpLogs={this.getDhcpLogs.bind(this)} getPhoneNumber={this.getPhoneNumber.bind(this)} properties={this.state.properties} closeModal={this._toggleModalVisibility.bind(this)}/>
                </TouchableOpacity>
                {this.state.isModalCashVisible &&
                    <Card style={{borderRadius: 0}}>
                        <Card.Content style={styles.fullSpace}>
                            <Picker
                                selectedValue={this.state.cashtype}
                                mode='dropdown'
                                enabled={true}
                                onValueChange={(itemValue) => {
                                    this.setState({cashtype: itemValue});
                                }}>
                                {this._renderCashTypesList()}
                            </Picker>
                            <TextInput style={styles.input} placeholder='Введите сумму' value={this.state.newcash} onChangeText={value => this.setState({newcash: value.replace(/\D/g, '')})}/>
                            <TextInput style={styles.input} placeholder='Введите комментарий' value={this.state.newpaymentnote} onChangeText={value => this.setState({newpaymentnote: value})}/>
                            <TouchableOpacity>
                                <Button mode='contained' onPress={() => this.setUserBalance(element.login)} disabled={!~~this.state.newcash} dark={true}>ПОПОЛНИТЬ</Button>
                            </TouchableOpacity>
                            <Snackbar visible={this.state.snackbarVisible}
                                      onDismiss={() => this.setState({snackbarVisible: false})}
                                      action={{
                                          label: 'OK',
                                          onPress: () => {
                                              this.setState({snackbarVisible: false})
                                          },
                                      }}
                            >
                                {this.state.addCashMessage}
                            </Snackbar>
                        </Card.Content>
                    </Card>
                }
                <EditUserDetails mainUrl={mainUrl} rights={rights} visible={this.state.isModalEditUserVisible} search={this._getUserDetails.bind(this)} properties={editableProperties} closeModal={this._toggleModalEditUserVisibility.bind(this)}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fullSpace: {
        flex: 1
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 2
    },
    input: {
        marginBottom: 10
    }
});

SearchResultItem.propTypes = {
    mainUrl: PropTypes.string,
    element: PropTypes.object,
    cashTypes: PropTypes.object,
    index: PropTypes.number,
    rights: PropTypes.object
};
