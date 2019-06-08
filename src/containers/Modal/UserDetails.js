import React from 'react';
import { View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Portal, Text, Card, Title, List, Button } from 'react-native-paper';
import { Preloader } from '../Preloader';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import call from 'react-native-phone-call';
import PropTypes from 'prop-types';
import i18n from '../../services/i18n';

const requestTimeout = 5000;

export class ModalCardDetailsUser extends React.Component {
    state = {
        isModalCashVisible: false,
        isFetching: true,
        properties: null,
        dhcpLogs: 'Нет данных',
        ping: 'Нет данных'
    }

    _getUserDetails() {
        const { mainUrl, userLogin, rights } = this.props;
        return axios.get(`${mainUrl}/?module=android&action=userprofile&username=${userLogin}`, {timeout: requestTimeout})
            .then(res => {
                if (res.data && res.data.data && res.data.data[userLogin]) {
                    this.setState({properties: res.data.data[userLogin], isFetching: false});
                    if (rights.PLPINGER && rights.PLPINGER.rights) {
                        this.getPing(userLogin);
                    }
                    if (rights.PLDHCP && rights.PLDHCP.rights) {
                        this.getDhcpLogs(userLogin);
                    }
                } else this.setState({properties: {error: i18n.t('downloadError')}, isFetching: false});
            })
            .catch((err) => {this.setState({properties: {error: i18n.t('errorNetwork')}, isFetching: false});console.log({pingError: err});});
    }

    getDhcpLogs(userLogin) {
        const { mainUrl } =  this.props;
        this.setState({isFetching: true});
        return axios.get(`${mainUrl}/?module=android&action=pl_dhcp&username=${userLogin}`, {timeout: requestTimeout})
            .then(res => {
                if (res.data.data && res.data.data[userLogin] && res.data.data[userLogin].dhcp) {
                    this.setState({dhcpLogs: res.data.data[userLogin].dhcp, isFetching: false});
                } else this.setState({dhcpLogs: i18n.t('noLogs')});
            })
            .catch(dhcpError => {
                console.log({dhcpError});
                this.setState({dhcpLogs: i18n.t('errorNetwork')});
            });
    }

    getPing(userLogin) {
        const { mainUrl } =  this.props;
        this.setState({isFetching: true});
        return axios.get(`${mainUrl}/?module=android&&action=pl_pinger&username=${userLogin}`, {timeout: requestTimeout})
            .then(res => {
                if (res.data.data && res.data.data[userLogin] && res.data.data[userLogin].ping) {
                    this.setState({ping: res.data.data[userLogin].ping, isFetching: false});
                } this.setState({ping: i18n.t('downloadError')});
            })
            .catch(pingErr => {console.log({pingErr});this.setState({dhcpLogs: i18n.t('errorNetwork'), isFetching: false});});
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

    _renderAllProperties() {
        const { properties } = this.state;
        return _.map(properties, (value, index) => {
            if (index === 'mobile' || index === 'phone') {
                return this.getPhoneNumber(value);
            }
            if (value) {
                return (
                    <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                        <Text style={{marginRight: 5}}>{index.toUpperCase()}:</Text>
                        <Text selectable style={{flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right'}}>{value}</Text>
                    </View>
                );
            }
        });
    }

    componentDidMount() {
        this._getUserDetails();
    }

    render() {
        const { visible, closeModal, userLogin, rights } = this.props;
        return (
            <Modal visible={visible} animationType='slide' onRequestClose={closeModal} style={{flex: 1}}>
                <Card style={{flex: 1, padding: 5, position: 'relative', borderRadius: 0}}>
                    <Card.Content style={{flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4, marginBottom: 4,  borderBottomWidth: 2, borderBottomColor: 'rgba(81, 138, 201, 1)'}}>
                            <TouchableOpacity style={{width: 22}}
                                              onPress={closeModal}
                            >
                                <Icon name='reply' size={22} color='rgba(81, 138, 201, 1)'/>
                            </TouchableOpacity>
                            <Title style={{color: 'rgba(81, 138, 201, 1)'}}>{i18n.t('modal.customer')}</Title>
                            <TouchableOpacity onPress={() => this.setState({isModalCashVisible: true})}>
                                <Icon name='user' size={35} color='rgba(81, 138, 201, 1)'/>
                            </TouchableOpacity>
                        </View>
                        {this.state.isFetching && !this.state.properties
                            ? (<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><Preloader/></View>)
                            : (<ScrollView style={{flex: 1}}>
                                {this._renderAllProperties()}
                            </ScrollView>)}
                        <List.Section>
                            {(this.state.dhcpLogs && rights.PLDHCP && rights.PLDHCP.rights) && (
                                <List.Accordion style={{borderBottomWidth: 2, borderColor: 'rgba(81, 138, 201, 1)'}} title={i18n.t('seeDhcp')}>
                                    <TouchableOpacity style={{margin: 5}} onPress={() => this.getDhcpLogs(userLogin)}>
                                        <Button loading={this.state.isFetching} disabled={this.state.isFetching} mode='contained' dark={true} style={{height: 35, alignItems: 'center', justifyContent: 'center'}}>{!this.state.isFetching && i18n.t('get')}</Button>
                                    </TouchableOpacity>
                                    <ScrollView style={{height: 170}}>
                                        <Text selectable>{this.state.dhcpLogs}</Text>
                                    </ScrollView>
                                </List.Accordion>
                            )}
                            {(this.state.ping && rights.PLPINGER && rights.PLPINGER.rights) && (
                                <List.Accordion style={{borderBottomWidth: 2, borderColor: 'rgba(81, 138, 201, 1)'}} title={i18n.t('seePing')}>
                                    <TouchableOpacity style={{margin: 5}} onPress={() => this.getPing(userLogin)}>
                                        <Button loading={this.state.isFetching} disabled={this.state.isFetching} mode='contained' dark={true} style={{height: 35, alignItems: 'center', justifyContent: 'center'}}>{!this.state.isFetching && i18n.t('get')}</Button>
                                    </TouchableOpacity>
                                    <ScrollView style={{height: 170}}>
                                        <Text selectable>{this.state.ping}</Text>
                                    </ScrollView>
                                </List.Accordion>
                            )}
                        </List.Section>
                    </Card.Content>
                </Card>
            </Modal>
        );
    }
}


ModalCardDetailsUser.propTypes = {
    mainUrl: PropTypes.string,
    userLogin: PropTypes.string,
    visible: PropTypes.bool,
    closeModal: PropTypes.func,
    rights: PropTypes.object
};
