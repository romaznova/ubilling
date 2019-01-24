import React from 'react';
import { Card, Text, TextInput, Title, Button } from 'react-native-paper';
import { Image, TouchableOpacity, View, Picker, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { ModalCardDetailsUser } from '../Modal/UserDetails';
import { EditableField } from './EditableField';
import { ModalMainButton } from './ModalMainButton';
import PropTypes from 'prop-types';

export class UserTaskModalUpdate extends React.Component {
    state = {
        isModalEditable: false,
        showUserDetails: false,
        element: {
            id: '',
            starttime: '',
            startdate: '',
            address: '',
            phone: '',
            jobtype: '',
            jobnote: '',
            employee: ''
        }
    }

    _enableEditTask() {
        if (!this.state.isModalEditable) {
            this.setState(_.assign({}, this.state, {isModalEditable: true}));
        }
    }

    _disableEditTask() {
        if (this.state.isModalEditable) {
            this.setState(_.assign({}, this.state, {isModalEditable: false}));
        }
    }

    _renderEmployeesList() {
        const { staff } = this.props;
        const array = [];
        _.forIn(staff.employees, (value, index) => {
            array.push({index, value});
        });
        return _.map(_.sortBy(array, e => e.value), (element) => (<Picker.Item key={element.index} label={element.value} value={element.index} />));
    }

    _renderJobTypes() {
        const { jobtypes } = this.props;
        const array = [];
        _.forIn(jobtypes, (value, index) => (
            array.push(<Picker.Item key={index} label={value} value={index} />)
        ));
        return array;
    }

    _resetElementStateToDefault(callback) {
        const { element } = this.props;
        const data = {
            id: element.id,
            starttime: element.starttime,
            startdate: element.startdate,
            address: element.address,
            phone: element.phone,
            jobtype: element.jobtype,
            jobnote: element.jobnote,
            employee: element.employee
        };
        this.setState(_.assign({}, this.state,  _.assign({}, this.state, {element: data})), callback);
    }

    _changeElementAddress(address) {
        const data = _.assign({}, this.state.element, {address: address});
        this.setState(_.assign({}, this.state, _.assign({}, this.state, {element: data})));
    }

    _changeElementDescription(description) {
        const data = _.assign({}, this.state.element, {jobnote: description});
        this.setState(_.assign({}, this.state, _.assign({}, this.state, {element: data})));
    }

    _changeElementPhone(phone) {
        const data = _.assign({}, this.state.element, {phone: phone});
        this.setState(_.assign({}, this.state, _.assign({}, this.state, {element: data})));
    }

    _closeUserDetails() {
        this.setState({showUserDetails: false});
    }

    componentWillReceiveProps() {
        this._resetElementStateToDefault();
    }

    render() {
        const { element, visible, staff, getPhoneNumber, getStatus, _setModalVisibility, changeTask, jobtypes, mainUrl, rightsChangeDate} = this.props;
        return (
            <Modal style={{flex: 1}} visible={visible} animationType='slide' onRequestClose={() => {this._disableEditTask(); _setModalVisibility();}}>
                <Card style={{flex: 1, padding: 5, borderRadius: 0}}>
                    <Card.Content style={{flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4, marginBottom: 4,  borderBottomWidth: 2, borderBottomColor: 'rgba(81, 138, 201, 1)'}}>
                            <TouchableOpacity style={{width: 22}}
                                onPress={() => {this._disableEditTask(); _setModalVisibility();}}
                            >
                                <Icon name='reply' size={22} color='rgba(81, 138, 201, 1)'/>
                            </TouchableOpacity>
                            <Title style={{color: 'rgba(81, 138, 201, 1)'}}>Информация о заявке</Title>
                            <Icon name='info' size={35} color='rgba(81, 138, 201, 1)'/>
                        </View>
                        <ScrollView style={{flex: 1}}>
                            {(!!element.admin && !this.state.isModalEditable) && (
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                    <Text>Создал(а): </Text>
                                    <Text style={{textAlign: 'right', fontSize: 16, fontWeight: '500', flex: 1}}>{staff.admins[element.admin]}</Text>
                                </View>
                            )}
                            {(!!element.date && !this.state.isModalEditable) && (
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                    <Text>Дата создания: </Text>
                                    <Text style={{textAlign: 'right', fontSize: 16, fontWeight: '500', flex: 1}}>{moment(element.date).format('DD MMMM YYYY в hh:mm')}</Text>
                                </View>
                            )}
                            {(!!element.login && !this.state.isModalEditable) && (
                                <TouchableOpacity style={{marginBottom: 2}} onPress={() => {this.setState({showUserDetails: true});}}>
                                    <Button mode='contained' dark={true}>Карточка абонента</Button>
                                </TouchableOpacity>
                            )}
                            {!!element.employee && (
                                <View style={{backgroundColor: 'rgba(81, 138, 201, 0.1)', marginBottom: 2, padding: 5}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Text style={{marginRight: 10}}>Мастер:</Text>
                                        {this.state.isModalEditable
                                            ?
                                            (<Picker
                                                selectedValue={this.state.element.employee}
                                                style={{flex: 1, height: 40}}
                                                mode='dropdown'
                                                enabled={this.state.isModalEditable}
                                                onValueChange={(itemValue) => {
                                                    const data = _.assign({}, this.state.element, {employee: itemValue});
                                                    this.setState(_.assign({}, this.state, {element: data}));
                                                }}>
                                                {this._renderEmployeesList()}
                                            </Picker>)
                                            :
                                            (<Text style={{flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right'}}>{staff.employees[element.employee]}</Text>)}
                                    </View>
                                </View>
                            )}
                            <View style={{flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(81, 138, 201, 0.1)', padding: 5, marginBottom: 2}}>
                                {!!element.startdate && (
                                    <View style={{flex: 2}}>
                                        <Text style={{flex: 1}}>Выполнить нужно:</Text>
                                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                            {rightsChangeDate && (
                                                <DatePicker style={{padding: 0, width: 30}}
                                                    mode="date"
                                                    date={this.state.element.startdate}
                                                    is24Hour={true}
                                                    androidMode='spinner'
                                                    format="YYYY-MM-DD"
                                                    disabled={!this.state.isModalEditable}
                                                    iconSource={null}
                                                    hideText={true}
                                                    iconComponent={ <Image style={{width: 30}} resizeMode='contain' source={require('../../images/calendar.png')} />}
                                                    onDateChange={date => {
                                                        const data = _.assign({}, this.state.element, {startdate: date});
                                                        this.setState(_.assign({}, this.state, {element: data}));
                                                    }}
                                                />)}
                                            <Text style={{flex: 1, fontSize: 16, fontWeight: this.state.isModalEditable ? '400' : '500', margin: 5}}>{moment(this.state.element.startdate).format('Do MMMM YYYY')}</Text>
                                        </View>
                                    </View>
                                )}
                                {!!element.starttime && (
                                    <View style={{flex: 1}}>
                                        <Text style={{flex: 1}}>Время:</Text>
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <DatePicker style={{width: 30, margin: 0, padding: 0}}
                                                mode="time"
                                                date={this.state.element.starttime}
                                                is24Hour={true}
                                                androidMode='spinner'
                                                format="HH:mm"
                                                disabled={!this.state.isModalEditable}
                                                iconSource={null}
                                                hideText={true}
                                                iconComponent={ <Image style={{width: 30}} resizeMode='contain' source={require('../../images/clocks.png')} />}
                                                onDateChange={time => {
                                                    const data = _.assign({}, this.state.element, {starttime: time});
                                                    this.setState(_.assign({}, this.state, {element: data}));
                                                }}
                                            />
                                            <Text style={{flex: 1, fontSize: 16, fontWeight: this.state.isModalEditable ? '400' : '500', margin: 5}}>{moment(this.state.element.starttime, 'HH:mm:ss').format('HH:mm')}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                            {!!element.address && (
                                <EditableField label='Адрес:' value={this.state.element.address} editable={this.state.isModalEditable} _changeElement={this._changeElementAddress.bind(this)}/>
                            )}
                            {!!element.jobtype && (
                                <View style={{backgroundColor: 'rgba(81, 138, 201, 0.1)', marginBottom: 2, padding: 5}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Text style={{marginRight: 10}}>Тип заявки:</Text>
                                        {this.state.isModalEditable
                                            ?
                                            (<Picker selectedValue={this.state.element.jobtype}
                                                style={{flex: 1, height: 40}}
                                                mode='dropdown'
                                                enabled={this.state.isModalEditable}
                                                onValueChange={(itemValue) => {
                                                    const data = _.assign({}, this.state.element, {jobtype: itemValue});
                                                    this.setState(_.assign({}, this.state, {element: data}));
                                                }}>
                                                {this._renderJobTypes()}
                                            </Picker>)
                                            :
                                            (<Text style={{flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right'}}>{jobtypes[element.jobtype]}</Text>)}
                                    </View>
                                </View>
                            )}
                            {!!element.jobnote && (
                                <EditableField label='Примечание:' value={this.state.element.jobnote} editable={this.state.isModalEditable} _changeElement={this._changeElementDescription.bind(this)}/>
                            )}
                            {!!(element.phone && element.phone.length > 2) && this.state.isModalEditable
                                ?
                                (<View style={{marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                    <TextInput value={this.state.element.phone}
                                        style={{backgroundColor: 'rgba(81, 138, 201, 0.1)'}}
                                        label='Номер телефона:'
                                        multiline={true}
                                        onChangeText={text => {this._changeElementPhone(text);}}
                                    />
                                </View>)
                                :
                                (<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 2, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                    {getPhoneNumber(this.state.element.phone)}
                                </View>)

                            }
                            {(!!element.status && !this.state.isModalEditable) && (
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                    <Text>Статус: </Text>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <TouchableOpacity style={{backgroundColor: 'rgba(81, 138, 201, 0.3)', alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 4}}>
                                            {getStatus(element.status)}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            {(!!element.enddate && !this.state.isModalEditable) && (
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                    <Text>Дата закрытия: </Text>
                                    <Text style={{textAlign: 'right', fontSize: 16, fontWeight: '500', flex: 1}}>{moment(element.enddate).format('DD MMMM YYYY')}</Text>
                                </View>
                            )}
                            {(!!element.donenote && !this.state.isModalEditable) && (
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                    <Text>Комментарий: </Text>
                                    <Text style={{textAlign: 'right', fontSize: 16, fontWeight: '500', flex: 1}}>{element.donenote}</Text>
                                </View>
                            )}
                        </ScrollView>
                        {!Number(element.status)
                            ?
                            (<ModalMainButton editable={this.state.isModalEditable}
                                _enableEditTask={this._enableEditTask.bind(this)}
                                _disableEditTask={this._disableEditTask.bind(this)}
                                _resetElementStateToDefault={this._resetElementStateToDefault.bind(this)}
                                changeTask={changeTask}
                                element={this.state.element}
                            />)
                            :
                            (<TouchableOpacity>
                                <View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity  style={{flex: 1, marginLeft: 2}} onPress={() => {_setModalVisibility();}}>
                                            <Button mode='contained' dark={true} style={{backgroundColor: '#ed6f5b'}}>Закрыть</Button>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>)}

                    </Card.Content>
                </Card>
                {!!element.login && (
                    <ModalCardDetailsUser visible={this.state.showUserDetails} _closeModal={this._closeUserDetails.bind(this)} mainUrl={mainUrl} userLogin={element.login}/>
                )}
            </Modal>
        );
    }
}

UserTaskModalUpdate.propTypes = {
    element: PropTypes.object,
    jobtypes: PropTypes.object,
    mainUrl: PropTypes.string,
    rightsChangeDate: PropTypes.bool,
    staff: PropTypes.object,
    visible: PropTypes.bool,
    changeTask: PropTypes.func,
    getPhoneNumber: PropTypes.func,
    getStatus: PropTypes.func,
    _setModalVisibility: PropTypes.func,
};
