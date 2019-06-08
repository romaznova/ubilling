import {StyleSheet, TouchableOpacity, View} from 'react-native';
import { Button, Card, Portal, Text, Title } from 'react-native-paper';
import moment from 'moment';
import React from 'react';
import { UserTaskModalUpdate } from '../../containers/UserTaskModalUpdate';
import { UserTaskModalStatus } from '../../containers/UserTaskModalStatus';
import _ from 'lodash';
import call from 'react-native-phone-call';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { UserTaskModalComments } from '../../containers/UserTaskModalComments';
import i18n from '../../services/i18n';

export class UndoneUserTask extends React.Component {
    state = {
        isModalUpdateOpen: false,
        isModalStatusOpen: false,
        isModalCommentsOpen: false
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextState, this.state) || !_.isEqual(this.props.element, nextProps.element);
    }

    setModalUpdateVisibility() {
        this.setState({isModalUpdateOpen: !this.state.isModalUpdateOpen});
    }

    setModalStatusVisibility() {
        this.setState({isModalStatusOpen: !this.state.isModalStatusOpen});
    }

    setModalCommentsVisibility() {
        this.setState({isModalCommentsOpen: !this.state.isModalCommentsOpen});
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

    getStatus(status) {
        switch (Number(status)) {
        case 0:
            return (
                <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor:'#ed6f5b', padding: 5, margin: 4, borderRadius: 18}}>
                    <Icon name='minus-circle' size={20} color='rgba(255,255,255,0.9)'/>
                    <Text style={{fontSize: 13, fontWeight: '500', textAlign: 'right', color: 'rgba(255,255,255,0.9)', marginLeft: 10}}>{i18n.t('task.undone')}</Text>
                </View>
            );
        case 1:
            return (
                <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor:'#00a600', padding: 5, margin: 4, borderRadius: 18}}>
                    <Icon name='check-circle' size={20} color='rgba(255,255,255,0.9)'/>
                    <Text style={{fontSize: 13, fontWeight: '500', textAlign: 'right', color: 'rgba(255,255,255,0.9)', marginLeft: 10}}>{i18n.t('task.done')}</Text>
                </View>
            );
        default:
            return (
                <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor:'#ed6f5b', padding: 5, margin: 4, borderRadius: 18}}>
                    <Icon name='minus-circle' size={20} color='rgba(255,255,255,0.9)'/>
                    <Text style={{fontSize: 13, fontWeight: '500', textAlign: 'right', color: 'rgba(255,255,255,0.9)', marginLeft: 10}}>{i18n.t('task.undone')}</Text>
                </View>
            );
        }
    }

    render() {
        const { element, jobtypes, mainUrl, login, staff, changeTaskStatus, changeTask, setTaskComment, getUndoneTask, rights } = this.props;
        return (
            <Card elevation={2} style={styles.card}>
                <Card.Content>
                    <View style={[styles.fullSpace, {flexDirection: 'row'}]}>
                        <Text style={[styles.fullSpace, styles.accentFont]}>{i18n.t('task.undoneMessage')} {element.startdate ? ` ${moment(element.startdate).format('D MMMM YYYY')}` : ''}</Text>
                        <TouchableOpacity onPress={() => {this.setState({isModalCommentsOpen: true});}} style={styles.commentsButton}>
                            <Icon name='comments-o' size={35} color='rgba(255, 255, 255, 1)'/>
                            {!!element.comments.length && (
                                <Text style={styles.commentsButtonLength}>{element.comments.length}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    {!!element.address && (<Text style={[styles.regularFontSize, {fontWeight: '500'}]}><Text style={{fontWeight: '400'}}>{i18n.t('modal.address')}: </Text>{element.address}</Text>)}
                    {!!element.jobtype && (<Text style={styles.regularFontSize}><Text>{i18n.t('modal.type')}: </Text>{jobtypes[element.jobtype]}</Text>)}
                    {!!element.startdate && (<Text style={styles.regularFontSize}>{i18n.t('task.undoneMessage')} {moment(element.startdate).fromNow()}</Text>)}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={[styles.fullSpace, {marginRight: 2}]} onPress={() => {this.setState({isModalUpdateOpen: false, isModalStatusOpen: true});}}>
                            <Button mode='contained' dark={true} style={{backgroundColor: '#00a600'}}>{i18n.t('confirm')}</Button>
                        </TouchableOpacity>
                        <TouchableOpacity  style={[styles.fullSpace, {marginLeft: 2}]} onPress={() => {this.setState({isModalUpdateOpen: true, isModalStatusOpen: false});}}>
                            <Button mode='contained' dark={true} style={{backgroundColor: 'rgba(81, 138, 201, 1)'}}>{i18n.t('edit')}</Button>
                        </TouchableOpacity>
                    </View>
                    <Portal>
                        <UserTaskModalUpdate element={element}
                            visible={this.state.isModalUpdateOpen}
                            staff={staff}
                            jobtypes={jobtypes}
                            getPhoneNumber={this.getPhoneNumber.bind(this)}
                            getStatus={this.getStatus.bind(this)}
                            setModalVisibility={this.setModalUpdateVisibility.bind(this)}
                            changeTask={(element, callback) => {getUndoneTask(); changeTask(element, callback); this.setModalUpdateVisibility();}}
                            mainUrl={mainUrl}
                            rights={rights}
                        />
                        <UserTaskModalStatus element={element}
                            staff={staff}
                            jobtypes={jobtypes}
                            visible={this.state.isModalStatusOpen}
                            setModalVisibility={this.setModalStatusVisibility.bind(this)}
                            changeTask={data => {getUndoneTask(); changeTaskStatus(data); this.setModalStatusVisibility();}}
                            login={login}
                            rights={rights}
                        />
                        <UserTaskModalComments element={element}
                            staff={staff}
                            setModalVisibility={this.setModalCommentsVisibility.bind(this)}
                            visible={this.state.isModalCommentsOpen}
                            setTaskComment={(id, comment) => {getUndoneTask(); setTaskComment(id, comment); this.setModalCommentsVisibility();}}
                        />
                    </Portal>
                </Card.Content>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    fullSpace: {
        flex: 1
    },
    card: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: '#fff'
    },
    commentsButton: {
        margin: 1,
        padding: 5,
        backgroundColor: 'rgba(81, 138, 201, 0.7)',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    commentsButtonLength: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500',
        marginBottom: 2
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    regularFontSize: {
        fontSize: 14
    },
    accentFont : {
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(255,51,0,0.9)'
    }
});

UndoneUserTask.propTypes = {
    element: PropTypes.object,
    jobtypes: PropTypes.objectOf(PropTypes.string),
    login: PropTypes.string,
    mainUrl: PropTypes.string,
    rights: PropTypes.object,
    staff: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
    changeTask: PropTypes.func,
    changeTaskStatus: PropTypes.func,
    getUndoneTask: PropTypes.func,
    setTaskComment: PropTypes.func
};
