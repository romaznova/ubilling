import React from 'react';
import { Card, Text, TextInput, Title, Button } from 'react-native-paper';
import { Image, TouchableOpacity, View, Picker, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import PropTypes from 'prop-types';
import i18n from '../../services/i18n';

export class UserTaskModalStatus extends React.Component {
    state = {
        editenddate: '',
        editemployeedone: '',
        editdonenote: '',
        changetask: '',
        change_admin: ''
    }

    _resetElementStateToDefault(callback) {
        const { element, login } = this.props;
        const data = {
            editenddate: element.enddate || this.state.editenddate || element.startdate,
            editemployeedone: element.employeedone || element.employee,
            editdonenote: element.donenote,
            changetask: element.id,
            change_admin: login
        };
        this.setState(_.assign({}, this.state,  data), callback);
    }

    _renderEmployeesList() {
        const { staff } = this.props;
        const array = [];
        _.forIn(staff.employees, (value, index) => {
            array.push({index, value});
        });
        const collection = _.sortBy(array, e => e.value);
        return _.map(collection, (element) => (<Picker.Item key={element.index} label={element.value} value={element.index} />));
    }

    componentWillReceiveProps() {
        this._resetElementStateToDefault();
    }

    render() {
        const { element, visible, staff, setModalVisibility, changeTask, jobtypes, rights } = this.props;
        return (
            <Modal style={{flex: 1}} visible={visible} animationType='slide' onRequestClose={() => {setModalVisibility();}}>
                <Card style={{flex: 1, padding: 5, position: 'relative', borderRadius: 0}}>
                    <Card.Content style={{flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4, marginBottom: 4,  borderBottomWidth: 2, borderBottomColor: 'rgba(81, 138, 201, 1)'}}>
                            <TouchableOpacity style={{width: 22}}
                                onPress={() => {setModalVisibility();}}
                            >
                                <Icon name='reply' size={22} color='rgba(81, 138, 201, 1)'/>
                            </TouchableOpacity>
                            <Title style={{color: 'rgba(81, 138, 201, 1)'}}>{!Number(element.status) ? i18n.t('modal.taskClose') : i18n.t('modal.taskClosed')}</Title>
                            <Icon name={!Number(element.status) ? 'pencil-square' : 'check-square'} size={35} color='rgba(81, 138, 201, 1)'/>
                        </View>
                        <ScrollView style={{flex: 1}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                <Text style={{marginRight: 5}}>{i18n.t('modal.address')}: </Text>
                                <Text style={{flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right'}}>{element.address}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                <Text style={{marginRight: 5}}>{i18n.t('modal.type')}: </Text>
                                <Text style={{flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right'}}>{jobtypes[element.jobtype]}</Text>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                <Text>{i18n.t('modal.closeDate')}: </Text>
                                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                    {!(rights.TASKMANNODONDATE && rights.TASKMANNODONDATE.rights) &&
                                    (
                                        <DatePicker style={{marginRight: 10, padding: 0, width: 30}}
                                            mode="date"
                                            date={this.state.editenddate}
                                            is24Hour={true}
                                            androidMode='spinner'
                                            format="YYYY-MM-DD"
                                            disabled={!!Number(element.status)}
                                            iconSource={null}
                                            hideText={true}
                                            iconComponent={ <Image style={{width: 30, position: 'relative'}} resizeMode='contain' source={require('../../images/calendar.png')} />}
                                            onDateChange={date => {
                                                this.setState(_.assign({}, this.state, {editenddate: date}));
                                            }}
                                        />
                                    )}
                                    <Text style={{fontSize: 16, fontWeight: !Number(element.status) ? '400' : '500'}}>{moment(this.state.editenddate).format('DD MMMM YYYY')}</Text>
                                </View>
                            </View>
                            <View style={{marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                {!Number(element.status)
                                    ?
                                    (<TextInput value={this.state.editdonenote}
                                        label={i18n.t('modal.comment')}
                                        multiline={true}
                                        onChangeText={text => {this.setState({editdonenote: text});}}
                                    />)
                                    :
                                    (<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Text style={{marginRight: 5}}>{i18n.t('modal.comment')}: </Text>
                                        <Text style={{flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right'}}>{this.state.editdonenote || i18n.t('modal.comment')}</Text>
                                    </View>)
                                }
                            </View>
                            <View>
                                {!Number(element.status)
                                    ?
                                    (<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                        <Text style={{marginRight: 5}}>{i18n.t('modal.done')}: </Text>
                                        <Picker
                                            selectedValue={this.state.editemployeedone}
                                            style={{flex: 1, height: 40}}
                                            mode='dropdown'
                                            enabled={this.state.isModalEditable}
                                            onValueChange={(itemValue) => {
                                                this.setState(_.assign({}, this.state, {editemployeedone: itemValue}));
                                            }}>
                                            {this._renderEmployeesList()}
                                        </Picker>
                                    </View>)
                                    :
                                    (<View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                        <Text style={{marginRight: 5}}>{i18n.t('modal.done')}: </Text>
                                        <Text style={{flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right'}}>{staff.employees[element.employeedone] || staff.employees[this.state.editemployeedone]}</Text>
                                    </View>)}
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                                <Text style={{marginRight: 5}}>{i18n.t('modal.closed')}: </Text>
                                <Text style={{flex: 1, fontSize: 16, fontWeight: '500', textAlign: 'right'}}>{Number(element.status) ? staff.admins[element.change_admin] : staff.admins[this.state.change_admin]}</Text>
                            </View>
                        </ScrollView>
                        {(rights.TASKMANDONE && rights.TASKMANDONE.rights) ?
                            !Number(element.status)
                                ?
                                (<View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity style={{flex: 1, marginRight: 2}} onPress={this.state.editdonenote && this.state.editdonenote.length > 3 ? () => {changeTask(this.state);} : null}>
                                            <Button mode='contained'
                                                dark={true}
                                                disabled={!(this.state.editdonenote && this.state.editdonenote.length > 3)}
                                                style={{backgroundColor: '#00a600'}}>{i18n.t('confirm')}</Button>
                                        </TouchableOpacity>
                                        <TouchableOpacity  style={{flex: 1, marginLeft: 2}} onPress={() => {this._resetElementStateToDefault();}}>
                                            <Button mode='contained' dark={true} style={{backgroundColor: '#ed6f5b'}}>{i18n.t('cancel')}</Button>
                                        </TouchableOpacity>
                                    </View>
                                </View>)
                                :
                                (<View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity  style={{flex: 1, marginLeft: 2}} onPress={() => {setModalVisibility();}}>
                                            <Button mode='contained' dark={true} style={{backgroundColor: '#ed6f5b'}}>{i18n.t('close')}</Button>
                                        </TouchableOpacity>
                                    </View>
                                </View>)
                            :
                            (<View style={{flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center'}}>
                                <Text style={{fontSize: 16, textAlign: 'center', margin: 40}}>{i18n.t('noRightsMessage')}</Text>
                            </View>)}
                    </Card.Content>
                </Card>
            </Modal>
        );
    }
}

UserTaskModalStatus.propTypes = {
    element: PropTypes.object,
    jobtypes: PropTypes.object,
    mainUrl: PropTypes.string,
    rights: PropTypes.object,
    staff: PropTypes.object,
    visible: PropTypes.bool,
    login: PropTypes.string,
    changeTask: PropTypes.func,
    getPhoneNumber: PropTypes.func,
    getStatus: PropTypes.func,
    setModalVisibility: PropTypes.func,
};

