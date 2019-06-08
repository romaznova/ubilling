import React from 'react';
import {View, Image, ScrollView, TouchableOpacity, ImageBackground, Dimensions, StyleSheet} from 'react-native';
import { Text, List, Button, Title, TextInput, Searchbar, BottomNavigation } from 'react-native-paper';
import { SearchResultItem } from './SearchResultItem';
import { Preloader } from '../../containers/Preloader';
import { Logo } from '../../containers/Logo';
import Icon from 'react-native-vector-icons/FontAwesome';
import connect from 'react-redux/es/connect/connect';
import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';
import {Header} from '../../components/Header';
import PropTypes from 'prop-types';
import i18n from '../../services/i18n';

const requestTimeout = 10000;

export class SearchScreen extends React.PureComponent {
    state = {
        isOnSearching: false,
        searchParams: '',
        searchResults: [],
        renderResults: 1
    }

    static navigationOptions = {
        drawerIcon: (
            <Icon name='search' size={22} color='rgba(81, 138, 201, 1)'/>
        ),
        title: 'drawer.search'
    }

    _renderSearchResults(result) {
        const { state } = this.props;
        const renderLength = 10;
        const array = result.slice(0, renderLength * this.state.renderResults);
        return _.map(array, (element, index) => {
            const { state } = this.props;
            return (
                <SearchResultItem key={element.login} rights={state.rights} searchParams={this.state.searchParams} search={() => {this._search(this.state.searchParams)}} element={element} index={index} mainUrl={`${state.user.urlMethod}${state.user.url}`} cashTypes={state.cashTypes}/>
            );
        });
    }

    _search(param) {
        const { state } = this.props;
        const data = {searchquery: `${param}`};
        this.setState({isOnSearching: true});
        let array = [];
        return axios.post(`${state.user.urlMethod}${state.user.url}/?module=android&action=usersearch`, qs.stringify(data), {timeout: requestTimeout})
            .then(res => {
                _.forIn(res.data.data, element => {
                    array.push(res.data.data[element.login]);
                    array = array.filter(element => element != null);
                });
                this.setState({searchResults: array, isOnSearching: false});
            })
            .catch(err => {
                console.log({searchErr: err});
                this.setState({isOnSearching: false});
            });
    }

    render() {
        const { state } = this.props;
        return(
            <View style={[styles.fullSpace, {backgroundColor: '#F5FCFF'}]}>
                <Header openDrawer={this.props.navigation.openDrawer}/>
                <View style={[styles.fullSpace]}>
                    <View style={[styles.fullSpace]}>
                        {state.rights.USERSEARCH && state.rights.USERSEARCH.rights
                        ?
                            <View>
                                <Title style={{textAlign: 'center'}}>{i18n.t('searchCustomer')}</Title>
                                <Searchbar style={styles.regularMargin} value={this.state.searchParams.replace('___')} label={i18n.t('searchEnter')} onChangeText={text => {this.setState({searchParams: text});}}/>
                                {this.state.searchParams && this.state.searchParams.length >= 3
                                    ?
                                    (
                                        <TouchableOpacity>
                                            <Button style={styles.regularMargin} onPress={() => {this._search(this.state.searchParams);}} disabled={this.state.isOnSearching} loading={this.state.isOnSearching} mode='contained' dark={true}>
                                                {!this.state.isOnSearching && i18n.t('search')}
                                            </Button>
                                        </TouchableOpacity>
                                    )
                                    : (<Text style={[styles.regularFontSize, styles.regularMargin, {textAlign: 'center'}]}>{i18n.t('searchCriteria')}</Text>)}
                            </View>
                        :
                            <View  style={styles.fullSpace}>
                                <Title style={{textAlign: 'center'}}>{i18n.t('noRightsMessage')}</Title>
                                <View style={[styles.fullSpace, {justifyContent: 'center'}]}>
                                    <Logo/>
                                </View>
                            </View>
                        }

                        {!!(this.state.searchResults && this.state.searchResults.length) && (
                            <Text style={styles.regularMargin}>
                                Всего результатов: <Text style={styles.accentFont}>{this.state.searchResults.length}</Text>
                            </Text>
                        )}
                        {(this.state.isOnSearching && !this.state.searchResults.length)
                            ?
                                <View>
                                    <Logo/>
                                    <Preloader text={i18n.t('searching')}/>
                                </View>
                            :
                                <ScrollView style={styles.fullSpace} overScrollMode='always'>
                                    {this._renderSearchResults(this.state.searchResults)}
                                    {this.state.searchResults.length > this.state.renderResults * 20 && (
                                        <TouchableOpacity>
                                            <Button dark={true}
                                                    onPress={() => this.setState({renderResults: this.state.renderResults + 1})}
                                                    mode='contained'
                                                    style={styles.regularMargin}>{i18n.t('showMore')}</Button>
                                        </TouchableOpacity>
                                    )}
                                </ScrollView>
                        }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fullSpace: {
        flex: 1
    },
    regularMargin: {
        margin: 5
    },
    regularFontSize: {
        fontSize: 15
    },
    accentFont: {
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(81, 138, 201, 1)'
    }
});

SearchScreen = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(SearchScreen);

SearchScreen.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};
