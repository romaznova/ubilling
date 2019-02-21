import React from 'react';
import { View, ScrollView, TouchableOpacity, Modal, StyleSheet, Picker } from 'react-native';
import { Portal, Text, Card, Title, Snackbar, Button, TextInput } from 'react-native-paper';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import PropTypes from 'prop-types';
import qs from 'qs';

const requestTimeout = 10000;

export class EditUserDetails extends React.Component {
    state = {
        snackbarVisible: false,
        responseMessage: '',
        properties: {}
    }

    _difference(object, base) {
        const changes = (object, base) => {
            return _.transform(object, function(result, value, key) {
                if (!_.isEqual(value, base[key])) {
                    result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                }
            });
        }

        return changes(object, base);
    }

    _checkEditCondet() {
        let newProperties;
        if (!!this.state.properties.seal && !!this.state.properties.length && !!this.state.properties.price) {
            newProperties = _.assign({}, this.state.properties, {editcondet: true});

        } else newProperties = _.assign({}, this.state.properties, {editcondet: '', seal: '', length: '', price: ''});
        this.setState({properties: newProperties}, this._setUserDetails.bind(this));
    }

    _setUserDetails() {
        const { mainUrl, search, properties } = this.props;
        const data = this._difference(properties, this.state.properties);
        const apiData = {};

        _.forIn(data, (value, prop) => {
            switch ((prop || '').toLowerCase()) {
                case 'realname':
                    _.assign(apiData, {newrealname: this.state.properties.realname});
                    break;
                case 'passive':
                    _.assign(apiData, {newpassive: this.state.properties.Passive});
                    break;
                case 'down':
                    _.assign(apiData, {newdown: this.state.properties.Down});
                    break;
                case 'password':
                    _.assign(apiData, {newpassword: this.state.properties.Password});
                    break;
                case 'phone':
                    _.assign(apiData, {newphone: this.state.properties.phone});
                    break;
                case 'mobile':
                    _.assign(apiData, {newmobile: this.state.properties.mobile});
                    break;
                case 'email':
                    _.assign(apiData, {newmail: this.state.properties.email});
                    break;
                case 'notes':
                    _.assign(apiData, {newnotes: this.state.properties.notes});
                    break;
                case 'seal':
                    _.assign(apiData, {newseal: this.state.properties.seal});
                    break;
                case 'length':
                    _.assign(apiData, {newlength: this.state.properties.length});
                    break;
                case 'price':
                    _.assign(apiData, {newprice: this.state.properties.price});
                    break;
                case 'editcondet':
                    _.assign(apiData, {editcondet: this.state.properties.editcondet});
                    break;
                default:
                    break;
            }
        });

        if (qs.stringify(apiData) && qs.stringify(apiData).length) {
            return axios.post(`${mainUrl}/?module=android&action=useredit&username=${this.state.properties.login}`, qs.stringify(apiData), {timeout: requestTimeout})
                .then(res => {
                    if (res.data && res.data.success) {
                        this.setState({snackbarVisible: true, responseMessage: res.data.message || 'Изменения сохранены'}, () => {search(this._checkProperties.bind(this))});
                    } else this.setState({properties, snackbarVisible: true, responseMessage: res.data.message || 'Не удалось изменить параметры'}, () => {search(this._checkProperties.bind(this))});
                })
                .catch(() => {this.setState({properties, snackbarVisible: true, responseMessage: 'Ошибка сети'});});
        } else this.setState({snackbarVisible: true, responseMessage: 'Вы не сделали никаких изменений'});
    }

    _setResetStatus() {
        const { mainUrl, search, properties } = this.props;
        const apiData = {reset: true};
        if (qs.stringify(apiData) && qs.stringify(apiData).length) {
            return axios.post(`${mainUrl}/?module=android&action=useredit&username=${this.state.properties.login}`, qs.stringify(apiData), {timeout: requestTimeout})
                .then(res => {
                    if (res.data && res.data.success) {
                        this.setState({snackbarVisible: true, responseMessage: res.data.message || 'Запрос отправлен'}, () => {search(this._checkProperties.bind(this))});
                    } else this.setState({properties, snackbarVisible: true, responseMessage: res.data.message || 'Не удалось изменить параметры'}, () => {search(this._checkProperties.bind(this))});
                })
                .catch(() => {this.setState({properties, snackbarVisible: true, responseMessage: 'Ошибка сети'});});
        } else this.setState({snackbarVisible: true, responseMessage: 'Не удалось отправить запрос'});
    }

    _renderProperties() {
        const { rights } = this.props;
        let index = 0;
        return _.map(this.state.properties, (value, prop) => {
            switch ((prop || '').toLowerCase()) {
                case 'login':
                    index = ++index;
                    return (
                        <View key={index} style={styles.editableArea}>
                            <Text>{prop.toUpperCase()}:</Text>
                            <Text style={{fontWeight: '500'}}>{this.state.properties.login}</Text>
                        </View>
                    );
                case 'realname':
                    if (rights.REALNAME && rights.REALNAME.rights) {
                        index = ++index;
                        return (
                            <View key={index} style={styles.editableArea}>
                                <Text>{prop.toUpperCase()}:</Text>
                                <TextInput value={this.state.properties.realname} onChangeText={newrealname => this._changeRealName(newrealname)}/>
                            </View>
                        );
                    } else return;
                case 'passive':
                    if (rights.PASSIVE && rights.PASSIVE.rights) {
                        index = ++index;
                        return (
                            <View key={index} style={styles.editableArea}>
                                <Text>{prop.toUpperCase()}:</Text>
                                <Picker selectedValue={this.state.properties.Passive} onValueChange={newpassive => this._changePassiveStatus(newpassive)}>
                                    <Picker.Item label='НЕТ' value="0"/>
                                    <Picker.Item label='ДА' value="1"/>
                                </Picker>
                            </View>
                        );
                    } else return;
                case 'down':
                    if (rights.DOWN && rights.DOWN.rights) {
                        index = ++index;
                        return (
                            <View key={index} style={styles.editableArea}>
                                <Text>{prop.toUpperCase()}:</Text>
                                <Picker selectedValue={this.state.properties.Down} onValueChange={newdown => this._changeDownStatus(newdown)}>
                                    <Picker.Item label='НЕТ' value="0"/>
                                    <Picker.Item label='ДА' value="1"/>
                                </Picker>
                            </View>
                        );
                    } else return;
                case 'password':
                    if (rights.PASSWORD && rights.PASSWORD.rights) {
                        index = ++index;
                        return (
                            <View key={index} style={styles.editableArea}>
                                <Text>{prop.toUpperCase()}:</Text>
                                <TextInput value={this.state.properties.Password} onChangeText={newpassword => this._changePassword(newpassword)}/>
                            </View>
                        );
                    } else return;
                case 'phone':
                    if (rights.PHONE && rights.PHONE.rights) {
                        index = ++index;
                        return (
                            <View key={index} style={styles.editableArea}>
                                <Text>{prop.toUpperCase()}:</Text>
                                <TextInput value={this.state.properties.phone} onChangeText={newphone => this._changePhoneNumber(newphone)}/>
                            </View>
                        );
                    } else return;
                case 'mobile':
                    if (rights.MOBILE && rights.MOBILE.rights) {
                        index = ++index;
                        return (
                            <View key={index} style={styles.editableArea}>
                                <Text>{prop.toUpperCase()}:</Text>
                                <TextInput value={this.state.properties.mobile} onChangeText={newmobile =>  this._changeMobileNumber(newmobile)}/>
                            </View>
                        );
                    } else return;
                case 'email':
                    if (rights.EMAIL && rights.EMAIL.rights) {
                        index = ++index;
                        return (
                            <View key={index} style={styles.editableArea}>
                                <Text>{prop.toUpperCase()}:</Text>
                                <TextInput value={this.state.properties.email} onChangeText={newmail => this._changeMail(newmail)}/>
                            </View>
                        );
                    } else return;
                case 'mac':
                    index = ++index;
                    return (
                        <View key={index} style={styles.editableArea}>
                            <Text>{prop.toUpperCase()}:</Text>
                            <TextInput value={this.state.properties.mac} onChangeText={newmac => this._changeMail(newmail)}/>
                        </View>
                    );
                default:
                return;
            }
        });
    }

    _changeRealName(realname) {
        const newProperties = _.assign({}, this.state.properties, {realname});
        this.setState({properties: newProperties});
    }

    _changePassword(Password) {
        const newProperties = _.assign({}, this.state.properties, {Password});
        this.setState({properties: newProperties});
    }

    _changePhoneNumber(phone) {
        const newProperties = _.assign({}, this.state.properties, {phone});
        this.setState({properties: newProperties});
    }

    _changeMobileNumber(mobile) {
        const newProperties = _.assign({}, this.state.properties, {mobile});
        this.setState({properties: newProperties});
    }

    _changeMail(email) {
        const newProperties = _.assign({}, this.state.properties, {email});
        this.setState({properties: newProperties});
    }

    _changeDownStatus(Down) {
        const newProperties = _.assign({}, this.state.properties, {Down});
        this.setState({properties: newProperties});
    }

    _changePassiveStatus(Passive) {
        const newProperties = _.assign({}, this.state.properties, {Passive});
        this.setState({properties: newProperties});
    }

    _changeNotes(notes) {
        const newProperties = _.assign({}, this.state.properties, {notes});
        this.setState({properties: newProperties});
    }

    _changeMac(mac) {
        const newProperties = _.assign({}, this.state.properties, {mac});
        this.setState({properties: newProperties});
    }

    _changeEditCondetSeal(seal) {
        const newProperties = _.assign({}, this.state.properties, {seal});
        this.setState({properties: newProperties});
    }

    _changeEditCondetLength(length) {
        const newProperties = _.assign({}, this.state.properties, {length});
        this.setState({properties: newProperties});
    }

    _changeEditCondetPrice(price) {
        const newProperties = _.assign({}, this.state.properties, {price});
        this.setState({properties: newProperties});
    }

    _checkProperties() {
        const { properties } = this.props;
        const newProperties = _.defaults({}, properties, this.state.properties);
        this.setState({properties: newProperties});
    }

    componentDidMount() {
        this._checkProperties();
    }

    componentWillReceiveProps() {
        this._checkProperties();
    }

    // componentDidUpdate() {
    //     console.log(this.state.properties);
    // }

    render() {
        const { visible, closeModal, rights } = this.props;

        return (
            <Modal visible={visible} animationType='slide' onRequestClose={closeModal} style={styles.fullSpace}>
                <Card style={styles.fullSpace}>
                    <Card.Content style={styles.fullSpace}>
                        <View style={styles.title}>
                            <TouchableOpacity style={{width: 22}} onPress={closeModal}>
                                <Icon name='reply' size={22} color='rgba(81, 138, 201, 1)'/>
                            </TouchableOpacity>
                            <Title style={{color: 'rgba(81, 138, 201, 1)'}}>Карточка абонента</Title>
                            <Icon name='user' size={35} color='rgba(81, 138, 201, 1)'/>
                        </View>
                        {(rights.RESET && rights.RESET.rights) && (
                            <View style={styles.editableArea}>
                                <Text>RESET:</Text>
                                <TouchableOpacity>
                                    <Button mode='contained' dark onPress={this._setResetStatus.bind(this)}>
                                        Reset
                                    </Button>
                                </TouchableOpacity>
                            </View>
                        )}
                        <ScrollView style={[styles.fullSpace, {marginBottom: 5}]}>
                            {this._renderProperties()}
                            {(rights.NOTES && rights.NOTES.rights) && (
                                <View style={styles.editableArea}>
                                    <Text>NEWNOTES:</Text>
                                    <TextInput value={this.state.properties.notes} onChangeText={newnotes => this._changeNotes(newnotes)}/>
                                </View>
                            )}
                            {(rights.CONDET && rights.CONDET.rights) && (
                                <View style={styles.editableArea}>
                                    <Text>EDITCONDET:</Text>
                                    <TextInput label='Метка кабеля' value={this.state.properties.seal} onChangeText={seal => this._changeEditCondetSeal(seal)}/>
                                    <View style={{flexDirection: 'row', marginTop: 5}}>
                                        <TextInput style={{flex: 1, marginRight: 2}} label='Длина кабеля (м)' value={this.state.properties.length} onChangeText={length => this._changeEditCondetLength(length)}/>
                                        <TextInput style={{flex: 1, marginLeft: 2}} label='Стоимость подключения' value={this.state.properties.price} onChangeText={price => this._changeEditCondetPrice(price)}/>
                                    </View>
                                </View>
                            )}

                        </ScrollView>
                        <TouchableOpacity>
                            <Button dark onPress={this._checkEditCondet.bind(this)} mode='contained'>Сохранить</Button>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>
                <Snackbar visible={this.state.snackbarVisible}
                          onDismiss={() => this.setState({snackbarVisible: false})}
                          action={{
                              label: 'OK',
                              onPress: () => {
                                  this.setState({snackbarVisible: false})
                              },
                          }}
                >
                    {this.state.responseMessage}
                </Snackbar>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    fullSpace: {
        flex: 1
    },
    editableArea: {
        marginBottom: 2,
        padding: 5,
        backgroundColor: 'rgba(81, 138, 201, 0.1)'
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 4,
        marginBottom: 4,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(81, 138, 201, 1)'
    }
});

EditUserDetails.propTypes = {
    mainUrl: PropTypes.string,
    visible: PropTypes.bool,
    closeModal: PropTypes.func,
    properties: PropTypes.object,
    rights: PropTypes.object
};
