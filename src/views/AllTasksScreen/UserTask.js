import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { UserTaskModalUpdate } from '../../containers/UserTaskModalUpdate';
import { UserTaskModalStatus } from '../../containers/UserTaskModalStatus';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import moment from 'moment';
import call from 'react-native-phone-call';
import PropTypes from 'prop-types';
import { UserTaskModalComments } from '../../containers/UserTaskModalComments';
import i18n from '../../services/i18n';

export class UserTask extends React.Component {
    state = {
        isModalUpdateOpen: false,
        isModalStatusOpen: false,
        isModalCommentsOpen: false,
        open: false
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextState, this.state) || !_.isEqual(this.props.element, nextProps.element);
    }

    getPhoneNumber(number) {
        let collection;
        if (number && number.length > 2) {
            collection = _.map(number.split(/\D/g), (element, index) => {
                if (element.length) {
                    return (
                        <TouchableOpacity onPress={() => {call({number: element, prompt: false}).catch(err => {console.warn(err);});}} key={index} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 5, padding: 10, height: 30, borderRadius: 15, backgroundColor: 'rgba(81, 138, 201, 1)'}}>
                            <Icon name='phone' size={25} color='rgba(255, 255, 255, 0.9)'/>
                            <Text style={{fontSize: 13, fontWeight: '500', marginLeft: 10, color: 'rgba(255, 255, 255, 0.9)'}}>{element}</Text>
                        </TouchableOpacity>
                    );
                } else return null;
            }).filter(el => el != null);
            return collection;
        }
    }

    getStatus(status) {
        status = Number(status);
        switch (status) {
        case 0:
            return (
                <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', backgroundColor:'#ed6f5b', padding: 5, margin: 4, borderRadius: 4}}>
                    <Icon name='minus-circle' size={20} color='rgba(255,255,255,0.9)'/>
                    <Text style={{fontSize: 12, fontWeight: '500', textAlign: 'right', color: 'rgba(255,255,255,0.9)', marginLeft: 10}}>{i18n.t('task.undone')}</Text>
                </View>
            );
        case 1:
            return (
                <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', backgroundColor:'#00a600', padding: 5, margin: 4, borderRadius: 4}}>
                    <Icon name='check-circle' size={20} color='rgba(255,255,255,0.9)'/>
                    <Text style={{fontSize: 12, fontWeight: '500', textAlign: 'right', color: 'rgba(255,255,255,0.9)', marginLeft: 10}}>{i18n.t('task.done')}</Text>
                </View>
            );
        default:
            return (
                <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', backgroundColor:'#ed6f5b', padding: 5, margin: 4, borderRadius: 4}}>
                    <Icon name='minus-circle' size={20} color='rgba(255,255,255,0.9)'/>
                    <Text style={{fontSize: 12, fontWeight: '500', textAlign: 'right', color: 'rgba(255,255,255,0.9)', marginLeft: 10}}>{i18n.t('task.undone')}</Text>
                </View>
            );
        }
    }

    setModalUpdateVisibility(callback) {
        this.setState({isModalUpdateOpen: !this.state.isModalUpdateOpen}, callback);
    }

    setModalStatusVisibility(callback) {
        this.setState({isModalStatusOpen: !this.state.isModalStatusOpen}, callback);
    }

    setModalCommentsVisibility(callback) {
        this.setState({isModalCommentsOpen: !this.state.isModalCommentsOpen}, callback);
    }

    render() {
        const { element, index, changeTask, changeTaskStatus, staff, jobtypes, login, tasksDate, employee, mainUrl, rights, activeSlideIndex, setTaskComment } = this.props;
        console.log('render - all');
        return (
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'stretch', backgroundColor: 'rgba(255, 255, 255, 1)', margin: 5, padding: 2, shadowColor: '#000',
                shadowOffset: { width: 1, height: 3 },
                shadowOpacity: 0.8,
                shadowRadius: 4,
                elevation: 2}} onPress={() => {
                this.setState({isModalUpdateOpen: true});
            }}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', margin: 1, width: 30, height: 80, backgroundColor: 'rgba(81, 138, 201, 1)'}}>
                            <Text style={{fontWeight: '500', color: 'rgba(255,255,255,0.9)'}}>{index + 1}</Text>
                        </View>
                        <Text style={{flex: 1, fontSize: 14, fontWeight: '500', padding: 5}}>{element.address}</Text>
                    </View>
                    {Number(employee) === 0 && (
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(81, 138, 201, 0.1)', padding: 5}}>
                            <Text>{i18n.t('modal.user')}: </Text>
                            <Text style={{flex: 1}}>{staff.employees[element.employee]}</Text>
                        </View>
                    )}
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: activeSlideIndex === 0 ? 2 : 3, padding: 5, margin: 1, backgroundColor: 'rgba(81, 138, 201, 0.1)', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 14, textAlign: 'center'}}>{jobtypes[element.jobtype]}</Text>
                        </View>
                        {activeSlideIndex === 0 && (
                            <View style={{flex: 1, margin: 1, padding: 5, backgroundColor: tasksDate === moment().format('YYYY-MM-DD') ? (!Number(element.status) &&  moment(element.starttime, 'HH:mm:ss').isBefore(moment())) ? 'rgba(237, 111, 91, 0.1)' : 'rgba(0, 166, 0, 0.1)' : 'rgba(81, 138, 201, 0.1)', justifyContent: 'center', alignItems: 'center'}}>
                                <Image resizeMode='contain'
                                    source={require('../../images/clocks-2.png')}
                                    style={{width: 300, height: 30}}
                                />
                                <Text style={{fontSize: 14, fontWeight: '500', textAlign: 'center'}}>{element.starttime ? moment(element.starttime, 'HH:mm:ss').format('HH:mm') : '--:--'}</Text>
                            </View>
                        )}
                        <TouchableOpacity onPress={() => {this.setState({isModalStatusOpen: true});}} style={{flex: 2, flexDirection: 'row', margin: 1, backgroundColor: 'rgba(81, 138, 201, 0.1)', justifyContent: 'center', alignItems: 'stretch'}}>
                            {this.getStatus(element.status)}
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch'}}>
                        <TouchableOpacity onPress={() => {this.setState({isModalCommentsOpen: true});}} style={{flex: 1, margin: 1, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Icon name='comments-o' size={35} color='rgba(81, 138, 201, 1)'/>
                                {!!element.comments.length && (
                                    <Text style={{color: 'rgba(81, 138, 201, 1)', fontSize: 10, fontWeight: '500'}}>{element.comments.length}</Text>
                                )}
                            </View>
                            {(!(!Number(element.status) && tasksDate === moment().format('YYYY-MM-DD')) && activeSlideIndex === 0) && (
                                <Text style={{marginLeft: 10, fontSize: 14, color: 'rgba(81, 138, 201, 1)'}}>{i18n.t('task.addComment')}</Text>
                            )}
                        </TouchableOpacity>
                        {((!Number(element.status) && tasksDate === moment().format('YYYY-MM-DD')) && activeSlideIndex === 0) && (
                            <View style={{flex: 4, padding: 5, margin: 1, backgroundColor: 'rgba(81, 138, 201, 0.1)', alignItems: 'flex-start', justifyContent: 'center'}}>
                                <Text style={{fontSize: 14}}>{i18n.t('task.start')} {element.starttime ? moment(element.starttime, 'HH:mm:ss').fromNow() : moment(element.startdate).format('DD MMMM')}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <UserTaskModalUpdate element={element}
                                     visible={this.state.isModalUpdateOpen}
                                     staff={staff}
                                     jobtypes={jobtypes}
                                     getPhoneNumber={this.getPhoneNumber.bind(this)}
                                     getStatus={this.getStatus.bind(this)}
                                     setModalVisibility={this.setModalUpdateVisibility.bind(this)}
                                     changeTask={element => {changeTask(element); this.setModalUpdateVisibility();}}
                                     mainUrl={mainUrl}
                                     rights={rights}
                />
                <UserTaskModalStatus element={element}
                                     staff={staff}
                                     jobtypes={jobtypes}
                                     visible={this.state.isModalStatusOpen}
                                     setModalVisibility={this.setModalStatusVisibility.bind(this)}
                                     changeTask={data => {changeTaskStatus(data); this.setModalStatusVisibility();}}
                                     login={login}
                                     rights={rights}
                />
                <UserTaskModalComments element={element}
                                       staff={staff}
                                       setModalVisibility={this.setModalCommentsVisibility.bind(this)}
                                       visible={this.state.isModalCommentsOpen}
                                       setTaskComment={(id, comment) => {setTaskComment(id, comment); this.setModalCommentsVisibility();}}
                />
            </TouchableOpacity>
        );
    }
}

UserTask.propTypes = {
    element: PropTypes.object,
    employee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    index: PropTypes.number,
    jobtypes: PropTypes.objectOf(PropTypes.string),
    login: PropTypes.string,
    mainUrl: PropTypes.string,
    rights: PropTypes.object,
    staff: PropTypes.object,
    tasksDate: PropTypes.string,
    activeSlideIndex: PropTypes.number,
    changeTask: PropTypes.func,
    changeTaskStatus: PropTypes.func,
    setTaskComment: PropTypes.func
};
