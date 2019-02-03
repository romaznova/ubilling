import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import { Text } from 'react-native-paper';
import { ModalCard } from '../../containers/Modal';
import { AddCash } from '../../containers/Modal/AddCash';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import call from 'react-native-phone-call';
import axios from 'axios';
import PropTypes from 'prop-types';

const requestTimeout = 10000;

export class SearchResultItem extends React.Component {
    state = {
        isModalVisible: false,
        isModalCashVisible: false,
        dhcpLogs: 'Логи пока не загрузились...',
        ping: 'Нет данных'
    };

    _toggleModalVisibility() {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    _toggleModalCashVisibility() {
        this.setState({isModalCashVisible: !this.state.isModalCashVisible});
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
        axios.get(`${mainUrl}/?module=android&&action=pl_pinger&username=${userLogin}`, {timeout: requestTimeout})
            .then(res => {
                this.setState({ping: res.data.data[userLogin].ping});
            })
            .catch(err => {console.log(err);this.setState({ping: 'Не удалось получить данные'});});
    }

    componentDidMount() {
        const { element } = this.props;
        this.getDhcpLogs(element.login);
        this.getPing(element.login);
    }

    render () {
        const { element, index, mainUrl, cashTypes } = this.props;
        return (
            <TouchableOpacity onPress={this._toggleModalVisibility.bind(this)} style={{margin: 4, padding: 4}}>
                <View style={styles.card}>
                    <View style={{justifyContent: 'center', alignItems: 'center', width: 30, height: 100, backgroundColor: 'rgba(81, 138, 201, 1)'}}>
                        <Text style={{fontWeight: '500', color: 'rgba(255,255,255,0.9)'}}>{index + 1}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', marginLeft: 10, marginRight: 10}}>
                        <Text style={{paddingBottom: 5, fontSize: 16, fontWeight: '500'}}>{element.fulladress}</Text>
                        <Text style={{paddingBottom: 5, fontSize: 14}}>{element.realname}</Text>
                        <Text style={{paddingBottom: 5, fontSize: 14}}>Баланс: ₴ {parseInt(element.Cash)}</Text>
                    </View>
                    <TouchableOpacity onPress={this._toggleModalCashVisibility.bind(this)} style={{padding: 5}}>
                        <Icon name='money' size={35} color='rgba(81, 138, 201, 1)'/>
                    </TouchableOpacity>
                </View>
                <ModalCard visible={this.state.isModalVisible} dhcpLogs={this.state.dhcpLogs} ping={this.state.ping} getPing={this.getPing.bind(this)} getDhcpLogs={this.getDhcpLogs.bind(this)} getPhoneNumber={this.getPhoneNumber.bind(this)} properties={element} _closeModal={this._toggleModalVisibility.bind(this)}/>
                <AddCash mainUrl={mainUrl} cashTypes={cashTypes} visible={this.state.isModalCashVisible} userLogin={element.login} realname={element.realname} cash={element.Cash} _closeModal={this._toggleModalCashVisibility.bind(this)}/>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    fullSpace: {
        flex: 1
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 2
    }
});

SearchResultItem.propTypes = {
    mainUrl: PropTypes.string,
    element: PropTypes.object,
    cashTypes: PropTypes.object,
    index: PropTypes.number
};
