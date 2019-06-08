import React from 'react';
import { View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Portal, Text, Card, Title, List, Button } from 'react-native-paper';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import i18n from '../../services/i18n';

export class ModalCard extends React.Component {

    _renderAllProperties() {
        const { properties, getPhoneNumber } = this.props;
        return _.map(properties, (value, index) => {
            if (value) {
                if (index === 'mobile' || index === 'phone') {
                    return getPhoneNumber(value);
                }
                return (
                    <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                        <Text style={{marginRight: 5}}>{index.toUpperCase()}: </Text>
                        <Text selectable style={{flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right'}}>{value}</Text>
                    </View>
                );
            }
        });
    }

    render() {
        const { visible, closeModal, dhcpLogs, ping, getPing, getDhcpLogs, properties, rights } = this.props;
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
                            <Icon name='user' size={35} color='rgba(81, 138, 201, 1)'/>
                        </View>
                        <ScrollView style={{flex: 1}}>
                            {this._renderAllProperties()}
                        </ScrollView>
                        <List.Section>
                            {(dhcpLogs && rights.PLDHCP && rights.PLDHCP.rights) && (
                                <List.Accordion style={{borderBottomWidth: 2, borderColor: 'rgba(81, 138, 201, 1)'}} title={i18n.t('seeDhcp')}>
                                    <ScrollView style={{height: 170}}>
                                        <TouchableOpacity onPress={() => getDhcpLogs(properties.login)}>
                                            <Button mode='contained' dark={true} style={{margin: 2}}>{i18n.t('get')}</Button>
                                        </TouchableOpacity>
                                        <Text selectable>{dhcpLogs}</Text>
                                    </ScrollView>
                                </List.Accordion>
                            )}
                            {(ping && rights.PLPINGER && rights.PLPINGER.rights) && (
                                <List.Accordion style={{borderBottomWidth: 2, borderColor: 'rgba(81, 138, 201, 1)'}} title={i18n.t('seePing')}>
                                    <ScrollView style={{height: 170}}>
                                        <TouchableOpacity onPress={() => getPing(properties.login)}>
                                            <Button mode='contained' dark={true} style={{margin: 2}}>{i18n.t('get')}</Button>
                                        </TouchableOpacity>
                                        <Text selectable>{ping}</Text>
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

ModalCard.propTypes = {
    dhcpLogs: PropTypes.string,
    ping: PropTypes.string,
    properties: PropTypes.object,
    visible: PropTypes.bool,
    closeModal: PropTypes.func,
    getDhcpLogs: PropTypes.func,
    getPhoneNumber: PropTypes.func,
    getPing: PropTypes.func,
    rights: PropTypes.object
};
