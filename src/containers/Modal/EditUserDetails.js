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
        properties: {
            editcondet: {
                newseal: '',
                newlength: '',
                newprice: ''
            }
        }
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

    _checkEditCondet(object) {
        if (_.isObject(object.editcondet)) {
            _.forIn(object.editcondet, (value) => {
                if (!value) {
                    delete object.editcondet;
                }
            });
        }

        return object;
    }

    _setUserDetails() {
        const { mainUrl, search, properties } = this.props;
        const difference = this._difference(properties, this.state.properties);
        const data = this._checkEditCondet(difference);
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
                case 'reset':
                    _.assign(apiData, {reset: this.state.properties.reset});
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
                        this.setState({snackbarVisible: true, responseMessage: res.data.message || 'Изменения сохранены'}, search);
                    } else this.setState({properties, snackbarVisible: true, responseMessage: res.data.message || 'Не удалось изменить параметры'}, search);
                })
                .catch(() => {this.setState({properties, snackbarVisible: true, responseMessage: 'Ошибка сети'});});
        } else this.setState({snackbarVisible: true, responseMessage: 'Вы не сделали никаких изменений'});
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

    _changeReset(reset) {
        const newProperties = _.assign({}, this.state.properties, {reset});
        this.setState({properties: newProperties});
    }

    _changeEditCondet(editcondet) {
        const newProperties = _.assign({}, this.state.properties, {editcondet});
        this.setState({properties: newProperties});
    }

    _checkProperties() {
        const { properties } = this.props;
        const newProperties = _.assign(properties, this.state.properties);
        this.setState({properties: newProperties});
    }

    componentDidMount() {
        this._checkProperties();
    }

    componentWillReceiveProps() {
        this._checkProperties();
    }

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
                        <ScrollView style={[styles.fullSpace, {marginBottom: 5}]}>
                            {this._renderProperties()}
                            {(rights.NOTES && rights.NOTES.rights) && (
                                <View style={styles.editableArea}>
                                    <Text>NEWNOTES:</Text>
                                    <TextInput value={this.state.properties.notes} onChangeText={newnotes => this._changeNotes(newnotes)}/>
                                </View>
                            )}
                            {(rights.RESET && rights.RESET.rights) && (
                                <View style={styles.editableArea}>
                                    <Text>RESET:</Text>
                                    <Picker selectedValue={this.state.properties.reset} onValueChange={reset => this._changeReset(reset)}>
                                        <Picker.Item label='НЕТ' value="0"/>
                                        <Picker.Item label='ДА' value="1"/>
                                    </Picker>
                                </View>
                            )}
                            {(rights.CONDET && rights.CONDET.rights) && (
                                <View style={styles.editableArea}>
                                    <Text>EDITCONDET:</Text>
                                    <TextInput label='Метка кабеля' value={this.state.properties.editcondet.newseal} onChangeText={newseal => this._changeEditCondet({newseal, newlength: this.state.properties.editcondet.newlength, newprice: this.state.properties.editcondet.newprice})}/>
                                    <View style={{flexDirection: 'row', marginTop: 5}}>
                                        <TextInput style={{flex: 1, marginRight: 2}} label='Длина кабеля (м)' value={this.state.properties.editcondet.newlength} onChangeText={newlength => this._changeEditCondet({newseal: this.state.properties.editcondet.newseal, newlength, newprice: this.state.properties.editcondet.newprice})}/>
                                        <TextInput style={{flex: 1, marginLeft: 2}} label='Стоимость подключения' value={this.state.properties.editcondet.newprice} onChangeText={newprice => this._changeEditCondet({newseal: this.state.properties.editcondet.newseal, newlength: this.state.properties.editcondet.newlength, newprice})}/>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                        <TouchableOpacity>
                            <Button dark onPress={this._setUserDetails.bind(this)} mode='contained'>Сохранить</Button>
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
