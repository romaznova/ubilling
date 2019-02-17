import React from 'react';
import {View, ScrollView, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import { Portal, Text, Card, Title, Snackbar, Button, TextInput } from 'react-native-paper';
import { Preloader } from '../Preloader';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import call from 'react-native-phone-call';
import PropTypes from 'prop-types';
import qs from 'qs';
import {AllTasksScreen} from '../../views/AllTasksScreen';

const requestTimeout = 10000;

export class EditUserDetails extends React.Component {
    state = {
        snackbarVisible: false,
        responseMessage: '',
        properties: {}
    }

    _setUserDetails() {
        const { mainUrl, search } = this.props;
        const data = _.assign({}, {
            username: this.state.properties.login || '',
            newpassword: this.state.properties.Password || '',
            newrealname: this.state.properties.realname || '',
            newphone: this.state.properties.phone || '',
            newmobile: this.state.properties.mobile || '',
            newmail: this.state.properties.email || '',
            newdown: this.state.properties.Down || '',
            newpassive: this.state.properties.Passive || '',
            newnotes: this.state.properties.newnotes || '',
            reset: this.state.properties.reset || '',
            editcondet: this.state.properties.editcondet || ''
        });

        return axios.post(`${mainUrl}/?module=android&action=useredit`, qs.stringify(data), {timeout: requestTimeout})
            .then(res => {
                if (res.data && res.data.success) {
                    this.setState({snackbarVisible: true, responseMessage: res.data.message || 'Изменения сохранены'}, search);
                } else this.setState({snackbarVisible: true, responseMessage: res.data.message || 'Не удалось изменить параметры'}, search);
            })
            .catch(() => {this.setState({snackbarVisible: true, responseMessage: 'Ошибка сети'}, search);});
    }

    _renderProperties() {
        let index = 0;
        return _.map(this.state.properties, (value, prop) => {
            switch ((prop || '').toLowerCase()) {
                case 'login':
                    index = ++index;
                    return <View key={index} style={styles.editableArea}>
                        <Text>{prop.toUpperCase()}:</Text>
                        <Text>{this.state.properties.login}</Text>
                    </View>;
                case 'realname':
                    index = ++index;
                    return <View key={index} style={styles.editableArea}>
                        <Text>{prop.toUpperCase()}:</Text>
                        <TextInput value={this.state.properties.realname} onChangeText={(newrealname) => this._changeRealName(newrealname)}/>
                    </View>;
                case 'passive':
                    index = ++index;
                    return <View key={index} style={styles.editableArea}>
                        <Text>{prop.toUpperCase()}:</Text>
                        <TextInput value={this.state.properties.Passive} onChangeText={(newpassive) => this._changePassiveStatus(newpassive)}/>
                    </View>;
                case 'down':
                    index = ++index;
                    return <View key={index} style={styles.editableArea}>
                        <Text>{prop.toUpperCase()}:</Text>
                        <TextInput value={this.state.properties.Down} onChangeText={(newdown) => this._changeDownStatus(newdown)}/>
                    </View>;
                case 'password':
                    index = ++index;
                    return <View key={index} style={styles.editableArea}>
                        <Text>{prop.toUpperCase()}:</Text>
                        <TextInput value={this.state.properties.Password} onChangeText={(newpassword) => this._changePassword(newpassword)}/>
                    </View>;
                case 'phone':
                    index = ++index;
                    return <View key={index} style={styles.editableArea}>
                        <Text>{prop.toUpperCase()}:</Text>
                        <TextInput value={this.state.properties.phone} onChangeText={(newphone) => this._changePhoneNumber(newphone)}/>
                    </View>;
                case 'mobile':
                    index = ++index;
                    return <View key={index} style={styles.editableArea}>
                        <Text>{prop.toUpperCase()}:</Text>
                        <TextInput value={this.state.properties.mobile} onChangeText={(newmobile) =>  this._changeMobileNumber(newmobile)}/>
                    </View>;
                case 'email':
                    index = ++index;
                    return <View key={index} style={styles.editableArea}>
                        <Text>{prop.toUpperCase()}:</Text>
                        <TextInput value={this.state.properties.email} onChangeText={(newmail) => this._changeMail(newmail)}/>
                    </View>;
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

    _changeNotes(newnotes) {
        const newProperties = _.assign({}, this.state.properties, {newnotes});
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

    componentDidMount() {
        const { properties } = this.props;
        this.setState({properties});
    }

    componentWillReceiveProps() {
        const { properties } = this.props;
        this.setState({properties});
    }

    render() {
        const {visible, closeModal} = this.props;
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
                            <View style={styles.editableArea}>
                                <Text>NEWNOTES:</Text>
                                <TextInput value={this.state.properties.newnotes} onChangeText={(newnotes) => this._changeNotes(newnotes)}/>
                            </View>
                            <View style={styles.editableArea}>
                                <Text>RESET:</Text>
                                <TextInput value={this.state.properties.reset} onChangeText={(reset) => this._changeReset(reset)}/>
                            </View>
                            <View style={styles.editableArea}>
                                <Text>EDITCONDET:</Text>
                                <TextInput value={this.state.properties.editcondet} onChangeText={(editcondet) => this._changeEditCondet(editcondet)}/>
                            </View>
                        </ScrollView>
                        <TouchableOpacity onPress={this._setUserDetails.bind(this)}>
                            <Button dark mode='contained'>Сохранить</Button>
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
    properties: PropTypes.object
};
