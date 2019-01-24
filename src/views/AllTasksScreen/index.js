import React from 'react';
import {View, TouchableOpacity, Picker, Image, ImageBackground, ActivityIndicator, StyleSheet} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import connect from 'react-redux/es/connect/connect';
import DatePicker from 'react-native-datepicker';
import { UserTasksList } from './UserTasksList';
import qs from 'qs';
import { setAllTasks, setAllTasksDate, setAllTasksSort, requestAllTasks, requestAllTasksByDateInterval, setAllDateIntervalStart, setAllDateIntervalEnd } from '../../actions/allTasks';
import { setEmployees, setAdmins } from '../../actions/staff';
import { setAllJobTypes } from '../../actions/jobtypes';
import { Preloader } from '../../containers/Preloader';
import { Logo } from '../../containers/Logo';
import _ from 'lodash';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { Header } from '../../components/Header';
import { setUndoneTasks } from '../../actions/messages';
import PropTypes from 'prop-types';
import {modifyTask, modifyTaskStatus, setTaskComment} from '../../actions/tasks';
import {Sort} from '../../containers/Sort';

export class AllTasksScreen extends React.Component {

    static navigationOptions = {
        drawerIcon: (
            <Icon name='users' size={22} color='rgba(81, 138, 201, 1)'/>
        ),
        title: 'ВСЕ ЗАЯВКИ'
    }

    state = {
        date: moment().format('YYYY-MM-DD'),
        employee: 0,
        activeSlideIndex: 0,
        renderResults: 1
    }

    _changeEmployee(employee) {
        this.setState({employee: employee});
    }

    _getTasksByDate(callback) {
        const { state, dispatch } = this.props;
        if (state.allTasks.tasksByDate.length) {
            _.map(state.allTasks.tasksByDate, elem => {
                if (elem.date === this.state.date) {
                    dispatch(setAllTasks(elem.data));
                    dispatch(setAllTasksDate(elem.date));
                }
            });
        }
        if (callback) {
            callback();
        }
    }

    _getAllEmployees() {
        const { state, dispatch } = this.props;
        if (!_.keys(state.staff.employees).length) {
            setEmployees(state, dispatch);
        }
    }

    _getAllAdmins() {
        const { state, dispatch } = this.props;
        if (!_.keys(state.staff.admins).length) {
            dispatch(setAdmins(state, dispatch));
        }
    }

    _getAllJobTypes() {
        const { state, dispatch } = this.props;
        if (!_.keys(state.jobtypes).length) {
            dispatch(setAllJobTypes(state, dispatch));
        }
    }

    changeTask(e) {
        const { state, dispatch } = this.props;
        const data = qs.stringify({taskid: e.id, modifystarttime: e.starttime, modifystartdate: e.startdate, modifytaskaddress: e.address, modifytaskphone: e.phone || e.mobile, modifytaskjobtype: e.jobtype, modifytaskemployee: e.employee, modifytaskjobnote: e.jobnote});
        dispatch(modifyTask(state, data));
        this._getTasks(this.state.date, this.state.employee, () => {
            this.sortTasks();
        });
    }

    changeTaskStatus(data) {
        const { state, dispatch } = this.props;
        dispatch(modifyTaskStatus(state, qs.stringify(data)));
        this._getTasks(this.state.date, this.state.employee, () => {
            this.sortTasks();
        });
    }

    _getTasks(date, employee) {
        const { state, dispatch } = this.props;
        this.setState({date: date, employee: employee, renderResults: 1}, () => this._getTasksByDate(() => dispatch(requestAllTasks(state, date, employee))));
    }

    _getTasksByDateInterval(employee) {
        const { state, dispatch } = this.props;
        if (state.allTasks.dateInterval.start && state.allTasks.dateInterval.end && !!employee) {
            this.setState({renderResults: 1});
            dispatch(requestAllTasksByDateInterval(state, state.allTasks.dateInterval, employee));
        }
    }

    _getUndoneTasks() {
        const { state, dispatch } = this.props;
        dispatch(setUndoneTasks(state));
    }

    setTaskComment(id, comment) {
        const { state, dispatch } = this.props;
        const data = qs.stringify({taskid: id, newcommentstext: comment});
        dispatch(setTaskComment(state, data));
        this._getTasks(this.state.date, this.state.employee, () => {
            this.sortTasks();
        });
    }

    _setDateIntervalStart(date) {
        const { state, dispatch } = this.props;
        dispatch(setAllDateIntervalStart(_.assign({}, state.allTasks.dateInterval, {start: date})));
    }

    _setDateIntervalEnd(date) {
        const { state, dispatch } = this.props;
        dispatch(setAllDateIntervalEnd(_.assign({}, state.allTasks.dateInterval, {end: date})));
    }

    sortTasks(sort) {
        const { state, dispatch } = this.props;
        dispatch(setAllTasks(_.sortBy(state.allTasks.tasks, [
            sort.status && 'status',
            sort.time && 'starttime',
            sort.address && 'address'
        ])));
    }

    sortTasksByStatus() {
        const { state, dispatch } = this.props;
        const status = _.assign({}, state.allTasks.sort, {status: !state.allTasks.sort.status});
        dispatch(setAllTasksSort(status));
        this.sortTasks(status);
    }

    sortTasksByTime() {
        const { state, dispatch } = this.props;
        const status = _.assign({}, state.allTasks.sort, {time: !state.allTasks.sort.time});
        dispatch(setAllTasksSort(status));
        this.sortTasks(status);
    }

    sortTasksByAddress() {
        const { state, dispatch } = this.props;
        const status = _.assign({}, state.allTasks.sort, {address: !state.allTasks.sort.address});
        dispatch(setAllTasksSort(status));
        this.sortTasks(status);
    }

    _renderEmployeesList() {
        const { state } = this.props;
        const array = [];
        _.forIn(state.staff.employees, (value, index) => {
            array.push({index, value});
        });
        return _.map(_.sortBy(array, e => e.value), (element) => (<Picker.Item key={element.index} label={element.value} value={element.index} />));
    }

    _onChangeSlide(index) {
        if (this.state.activeSlideIndex !== index) {
            this.setState({activeSlideIndex: index});
        }
    }

    componentDidMount() {
        const { state } = this.props;
        this._getUndoneTasks();
        if (!(state.staff && state.staff.employees && state.staff.employees.length)) {
            this._getAllEmployees();
        }
        if (!(state.staff && state.staff.admins && state.staff.admins.length)) {
            this._getAllAdmins();
        }
        if (!(state.jobTypes && state.jobTypes.length)) {
            this._getAllJobTypes();
        }
        this._getTasks(this.state.date, this.state.employee, () => {
            this.sortTasks();
        });
    }

    render() {
        const { state } = this.props;
        return(
            <View style={{flex: 1, backgroundColor: '#F5FCFF'}}>
                <Header openDrawer={this.props.navigation.openDrawer}/>
                <View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <View style={{height: 60}}>
                            <Swiper showsPagination={false} onIndexChanged={this._onChangeSlide.bind(this)}>
                                <View style={[styles.flexRow, styles.swiperRow, {justifyContent: 'space-between'}]}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={[styles.regularFontSize, {marginLeft: 5}]}>Заявки на </Text>
                                        <View>
                                            <View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                                                <Text style={{fontSize: 14, marginRight: 5}}>{this.state.date ? moment(this.state.date).format('DD MMMM YYYY') : moment().format('DD MMMM YYYY')}</Text>
                                                <DatePicker style={{margin: 5, width: 40}}
                                                    mode="date"
                                                    date={moment(this.state.date).format('YYYY-MM-DD')}
                                                    androidMode='spinner'
                                                    format="YYYY-MM-DD"
                                                    iconSource={null}
                                                    hideText={true}
                                                    iconComponent={ <Image style={{width: 30}} resizeMode='contain' source={require('../../images/calendar.png')} />}
                                                    customStyles={{dateIcon: {position: 'relative', left: 0, top: 4, marginLeft: 0}}}
                                                    onDateChange={(date) => {
                                                        if (!(this.state.date === date)) {
                                                            this._getTasks(moment(date).format('YYYY-MM-DD'), this.state.employee);
                                                        }
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={{marginRight: 10}} onPress={() => {this._getTasks(this.state.date, this.state.employee);}}>
                                        {state.allTasks.isFetching && (state.allTasks.tasks && state.allTasks.tasks.length)
                                            ?
                                            (
                                                <ActivityIndicator color='rgba(81, 138, 201, 1)' size={25}/>
                                            )
                                            :
                                            (
                                                <Icon name='refresh' size={25} color='rgba(81, 138, 201, 1)'/>
                                            )}
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <View style={[styles.flexRow, styles.swiperRow, {justifyContent: 'space-between'}]}>
                                        <Text style={[styles.regularFontSize, {marginLeft: 5}]}>Заявки c </Text>
                                        <View>
                                            <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', position: 'relative'}}>
                                                <Text style={[styles.regularFontSize, {marginRight: 5, fontSize: 13}]}>{state.allTasks.dateInterval.start ? moment(state.allTasks.dateInterval.start).format('DD.MM.YY') : '__.__.__'}</Text>
                                                <DatePicker style={{margin: 5, width: 40}}
                                                    mode="date"
                                                    date={moment(state.allTasks.dateInterval.start).format('YYYY-MM-DD')}
                                                    androidMode='spinner'
                                                    format="YYYY-MM-DD"
                                                    iconSource={null}
                                                    hideText={true}
                                                    iconComponent={<Image style={{width: 30}} resizeMode='contain' source={require('../../images/calendar.png')} />}
                                                    customStyles={{dateIcon: {position: 'relative', left: 0, top: 4, marginLeft: 0}}}
                                                    onDateChange={(date) => {
                                                        this._setDateIntervalStart(date);
                                                        this._getTasksByDateInterval(this.state.employee);
                                                    }}
                                                />
                                                <Text style={[styles.regularFontSize, {marginRight: 5, fontSize: 13}]}>по {state.allTasks.dateInterval.end ? moment(state.allTasks.dateInterval.end).format('DD.MM.YY') : '__.__.__'}</Text>
                                                <DatePicker style={{margin: 5, width: 40}}
                                                    mode="date"
                                                    date={moment(state.allTasks.dateInterval.end).format('YYYY-MM-DD')}
                                                    androidMode='spinner'
                                                    format="YYYY-MM-DD"
                                                    iconSource={null}
                                                    hideText={true}
                                                    iconComponent={<Image style={{width: 30}} resizeMode='contain' source={require('../../images/calendar.png')} />}
                                                    customStyles={{dateIcon: {position: 'relative', left: 0, top: 4, marginLeft: 0}}}
                                                    onDateChange={(date) => {
                                                        this._setDateIntervalEnd(date);
                                                        this._getTasksByDateInterval(this.state.employee);
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Swiper>
                        </View>
                        <View style={[styles.swiperRow, {backgroundColor: '#fff', position: 'relative', top: -3}]}>
                            <Picker
                                selectedValue={this.state.employee}
                                mode='dropdown'
                                enabled={true}
                                onValueChange={(itemValue) => {
                                    this.state.activeSlideIndex === 0
                                        ? this._getTasks(state.allTasks.date, itemValue)
                                        : this.setState({employee: itemValue}, () => {this._getTasksByDateInterval(this.state.employee);this._getTasks(state.allTasks.date, itemValue);}) ;
                                }}>
                                <Picker.Item label='Все заявки' value={0} />
                                {this._renderEmployeesList()}
                            </Picker>
                        </View>
                        <View style={{flex: 1}}>
                            {state.allTasks.isFetching && (!(state.allTasks.tasks && state.allTasks.tasks.length) || this.state.activeSlideIndex)
                                ?
                                (<View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)'}}>
                                    <Logo/>
                                    <Preloader text='Идёт поиск заявок'/>
                                </View>)
                                :
                                (<GestureRecognizer style={{flex: 2}}
                                    onSwipeLeft={() => this.state.activeSlideIndex === 0 ? this._getTasks(moment(state.allTasks.date).add(1, 'days').format('YYYY-MM-DD'), this.state.employee) : null}
                                    onSwipeRight={() => this.state.activeSlideIndex === 0 ? this._getTasks(moment(state.allTasks.date).add(-1, 'days').format('YYYY-MM-DD'), this.state.employee) : null}
                                >
                                    <UserTasksList tasks={this.state.activeSlideIndex === 0 ? state.allTasks.tasks : state.allTasks.tasksByDateInterval}
                                        sort={state.allTasks.sort}
                                        tasksDate={state.allTasks.date}
                                        sortTasksByAddress={this.sortTasksByAddress.bind(this)}
                                        sortTasksByTime={this.sortTasksByTime.bind(this)}
                                        sortTasksByStatus={this.sortTasksByStatus.bind(this)}
                                        changeTask={this.changeTask.bind(this)}
                                        changeTaskStatus={this.changeTaskStatus.bind(this)}
                                        setTaskComment={this.setTaskComment.bind(this)}
                                        setRenderCounter={() => {this.setState({renderResults: this.state.renderResults + 1});}}
                                        renderResults={this.state.renderResults}
                                        employee={this.state.employee}
                                        staff={state.staff}
                                        jobtypes={state.jobTypes}
                                        login={state.user.login}
                                        mainUrl={`${state.user.urlMethod}${state.user.url}`}
                                        rightsChangeDate={state.rights.TASKMANDATE && state.rights.TASKMANDATE.rights}
                                        rightsChangeTaskStatus={state.rights.TASKMANDONE && state.rights.TASKMANDONE.rights}
                                        rightsChangeTaskStatusDoneDate={state.rights.TASKMANNODONDATE && state.rights.TASKMANNODONDATE.rights}
                                        activeSlideIndex={this.state.activeSlideIndex}
                                    />
                                </GestureRecognizer>)
                            }
                            {!!(state.allTasks.tasks && state.allTasks.tasks.length && this.state.activeSlideIndex === 0) && (
                                <Sort sort={state.allTasks.sort}
                                    sortTasksByAddress={this.sortTasksByAddress.bind(this)}
                                    sortTasksByTime={this.sortTasksByTime.bind(this)}
                                    sortTasksByStatus={this.sortTasksByStatus.bind(this)}/>
                            )}
                        </View>
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
    regularFontSize: {
        fontSize: 14,
        letterSpacing: 0.5
    },
    backgroundBlur: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    backgroundOpacity: {
        backgroundColor: 'rgba(81, 138, 201, 0.1)'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    swiperRow: {
        margin: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 2
    },
    datePicker: {
        margin: 5,
        width: 40
    },
    dateIcon: {
        position: 'relative',
        left: 0,
        top: 4,
        marginLeft: 0
    },
    dateIconComponent: {
        width: 30
    }
});

AllTasksScreen = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(AllTasksScreen);

AllTasksScreen.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};
