import React from 'react';
import { View, TouchableOpacity, Image, PanResponder, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import connect from 'react-redux/es/connect/connect';
import DatePicker from 'react-native-datepicker';
import { UserTasksList } from './UserTasksList';
import qs from 'qs';
import {
    requestTasks,
    setTasks,
    setTaskByDate,
    setTasksSort,
    requestAllTasksByDateInterval,
    setDateIntervalStart,
    setDateIntervalEnd,
    modifyTask,
    modifyTaskStatus,
    setTaskComment,
    setTasksDate
} from '../../actions/tasks';
import { setEmployees, setAdmins } from '../../actions/staff';
import { setAllJobTypes } from '../../actions/jobtypes';
import { setUndoneTasks } from '../../actions/messages';
import { Preloader } from '../../containers/Preloader';
import { Logo } from '../../containers/Logo';
import _ from 'lodash';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import { Header } from '../../components/Header';
import { Sort } from '../../containers/Sort';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import PropTypes from 'prop-types';
import i18n from '../../services/i18n';

const gestureConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
};

export class MainScreen extends React.Component {

    static navigationOptions = {
        drawerIcon: (
            <Icon name='user' size={26} color='rgba(81, 138, 201, 1)'/>
        ),
        title: 'drawer.userTasks'
    };

    state = {
        date: moment().format('YYYY-MM-DD'),
        activeSlideIndex: 0
    };

    _getTasks(date) {
        const { state, dispatch } = this.props;
        this.setState({date: date}, () => {
            const currentTasks = _.find(state.userTasks.tasksByDate, {date: date});
            if (!(currentTasks && currentTasks.data && currentTasks.data.length)) {
                dispatch(requestTasks(state, date));
            } else dispatch(setTasksDate(moment(date).format('YYYY-MM-DD')));
        });
    }

    _requestTasks(date) {
        const { state, dispatch } = this.props;
        this.setState({date: date}, () => dispatch(requestTasks(state, date)));
    }

    _getUndoneTasks() {
        const { state, dispatch } = this.props;
        dispatch(setUndoneTasks(state));
    }

    _getTasksByDateInterval() {
        const { state, dispatch } = this.props;
        if (state.userTasks.dateInterval.start && state.userTasks.dateInterval.end) {
            dispatch(requestAllTasksByDateInterval(state, state.userTasks.dateInterval));
        }
    }

    setTaskComment(id, comment, callback) {
        const { state, dispatch } = this.props;
        const data = qs.stringify({taskid: id, newcommentstext: comment});
        dispatch(setTaskComment(state, data));
        this._requestTasks(this.state.date);
        if (callback) {
            callback();
        }
    }

    _setDateIntervalStart(date) {
        const { state, dispatch } = this.props;
        const dateInterval = _.assign({}, state.userTasks.dateInterval, {start: date});
        dispatch(setDateIntervalStart(dateInterval));
    }

    _setDateIntervalEnd(date) {
        const { state, dispatch } = this.props;
        dispatch(setDateIntervalEnd(_.assign({}, state.userTasks.dateInterval, {end: date})));
    }

    sortTasks(sort) {
        const { state, dispatch } = this.props;
        dispatch(setTasks(_.sortBy(state.userTasks.tasks, [
            sort.status && 'status',
            sort.time && 'starttime',
            sort.address && 'address'
        ])));
    }

    sortTasksByStatus() {
        const { state, dispatch } = this.props;
        const status = _.assign({}, state.userTasks.sort, {status: !state.userTasks.sort.status});
        dispatch(setTasksSort(status));
    }

    sortTasksByTime() {
        const { state, dispatch } = this.props;
        const status = _.assign({}, state.userTasks.sort, {time: !state.userTasks.sort.time});
        dispatch(setTasksSort(status));
    }

    sortTasksByAddress() {
        const { state, dispatch } = this.props;
        const status = _.assign({}, state.userTasks.sort, {address: !state.userTasks.sort.address});
        dispatch(setTasksSort(status));
    }

    changeTask(e, callback) {
        const { state, dispatch } = this.props;
        const data = qs.stringify({taskid: e.id, modifystarttime: e.starttime, modifystartdate: e.startdate, modifytaskaddress: e.address, modifytaskphone: e.phone || e.mobile, modifytaskjobtype: e.jobtype, modifytaskemployee: e.employee, modifytaskjobnote: e.jobnote});
        dispatch(modifyTask(state, data));
        this._requestTasks(this.state.date);
        if (callback) {
            callback();
        }
    }

    changeTaskStatus(data, callback) {
        const { state, dispatch } = this.props;
        dispatch(modifyTaskStatus(state, qs.stringify(data)));
        this._requestTasks(this.state.date, () => {
            this.sortTasks();
        });
        if (callback) {
            callback();
        }
    }

    _onChangeSlide(index) {
        if (this.state.activeSlideIndex !== index) {
            this.setState({activeSlideIndex: index});
        }
    }

    _getNextDayTasks() {
        const { state } = this.props;
        const initialDate = moment(state.userTasks.date).add(1, 'days').format('YYYY-MM-DD');
        this._getTasks(initialDate);
    }

    _getPrevDayTasks() {
        const { state } = this.props;
        const initialDate = moment(state.userTasks.date).add(-1, 'days').format('YYYY-MM-DD');
        this._getTasks(initialDate);
    }

    componentDidMount() {
        this._getUndoneTasks();
        this._getTasks(this.state.date);
    }

    render() {
        const { state } = this.props;
        const userTasks = _.find(state.userTasks.tasksByDate, {date: state.userTasks.date});
        return(
            <View style={[styles.fullSpace, {backgroundColor: '#F5FCFF'}]}>
                <Header openDrawer={this.props.navigation.openDrawer}/>
                <View style={styles.fullSpace}>
                    <View style={[styles.fullSpace]}>
                        <View style={[{height: 60}]}>
                            <Swiper showsPagination={false} onIndexChanged={this._onChangeSlide.bind(this)}>
                                <View style={[styles.flexRow, styles.swiperRow, {justifyContent: 'space-between'}]}>
                                    <View style={styles.flexRow}>
                                        <Text style={[styles.regularFontSize, {marginLeft: 5}]}>{i18n.t('tasksFor')} </Text>
                                        <View>
                                            <View style={[styles.flexRow, {position: 'relative'}]}>
                                                <Text style={[styles.regularFontSize, {marginRight: 5}]}>{this.state.date ? moment(this.state.date).format('DD MMMM YYYY') : moment().format('DD MMMM YYYY')}</Text>
                                                <DatePicker style={styles.datePicker}
                                                    mode="date"
                                                    date={moment(this.state.date).format('YYYY-MM-DD')}
                                                    androidMode='spinner'
                                                    format="YYYY-MM-DD"
                                                    iconSource={null}
                                                    hideText={true}
                                                    iconComponent={ <Image style={styles.dateIconComponent} resizeMode='contain' source={require('../../images/calendar.png')} />}
                                                    customStyles={{}}
                                                    onDateChange={(date) => {
                                                        if (!(this.state.date === date)) {
                                                            this._getTasks(moment(date).format('YYYY-MM-DD'));
                                                        }
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={{marginRight: 10}} onPress={() => {this._requestTasks(this.state.date);}}>
                                        {state.userTasks.isFetching && (userTasks &&  userTasks.data && userTasks.data.length)
                                            ?
                                                <ActivityIndicator color='rgba(81, 138, 201, 1)' size={25}/>
                                            :
                                                <Icon name='refresh' size={25} color='rgba(81, 138, 201, 1)'/>
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <View style={[styles.backgroundOpacity, styles.flexRow, styles.swiperRow]}>
                                        <Text style={[styles.regularFontSize, {marginLeft: 5}]}>{i18n.t('tasksFrom')} </Text>
                                        <View>
                                            <View style={[styles.flexRow, {flexWrap: 'wrap', position: 'relative'}]}>
                                                <Text style={[styles.regularFontSize, styles.datePickerText]}>{state.userTasks.dateInterval.start ? moment(state.userTasks.dateInterval.start).format('DD.MM.YY') : '__.__.__'}</Text>
                                                <DatePicker style={styles.datePicker}
                                                    mode="date"
                                                    date={moment(state.userTasks.dateInterval.start).format('YYYY-MM-DD')}
                                                    androidMode='spinner'
                                                    format="YYYY-MM-DD"
                                                    iconSource={null}
                                                    hideText={true}
                                                    iconComponent={<Image style={styles.dateIconComponent} resizeMode='contain' source={require('../../images/calendar.png')} />}
                                                    customStyles={{dateIcon: styles.dateIcon}}
                                                    onDateChange={(date) => {
                                                        this._setDateIntervalStart(date);
                                                        this._getTasksByDateInterval();
                                                    }}
                                                />
                                                <Text style={[styles.regularFontSize, styles.datePickerText]}>{i18n.t('to')} {state.userTasks.dateInterval.end ? moment(state.userTasks.dateInterval.end).format('DD.MM.YY') : '__.__.__'}</Text>
                                                <DatePicker style={styles.datePicker}
                                                    mode="date"
                                                    date={moment(state.userTasks.dateInterval.end).format('YYYY-MM-DD')}
                                                    androidMode='spinner'
                                                    format="YYYY-MM-DD"
                                                    iconSource={null}
                                                    hideText={true}
                                                    iconComponent={<Image style={styles.dateIconComponent} resizeMode='contain' source={require('../../images/calendar.png')} />}
                                                    customStyles={{dateIcon: {position: 'relative', left: 0, top: 4, marginLeft: 0}}}
                                                    onDateChange={(date) => {
                                                        this._setDateIntervalEnd(date);
                                                        this._getTasksByDateInterval();
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Swiper>
                        </View>
                        <View style={styles.fullSpace}>
                            {state.userTasks.isFetching && (!(userTasks &&  userTasks.data && userTasks.data.length) || this.state.activeSlideIndex)
                                ?
                                    <View style={[styles.fullSpace, {justifyContent: 'center'}]}>
                                        <Logo/>
                                        <Preloader text={i18n.t('preloader')}/>
                                    </View>
                                :
                                    <GestureRecognizer style={[styles.fullSpace]}
                                                       config={gestureConfig}
                                    >
                                        <UserTasksList tasks={this.state.activeSlideIndex === 0 ? userTasks && userTasks.data ? userTasks.data : [] : state.userTasks.tasksByDateInterval}
                                            tasksDate={state.userTasks.date}
                                            sort={state.userTasks.sort}
                                            sortTasksByAddress={this.sortTasksByAddress.bind(this)}
                                            sortTasksByTime={this.sortTasksByTime.bind(this)}
                                            sortTasksByStatus={this.sortTasksByStatus.bind(this)}
                                            changeTask={this.changeTask.bind(this)}
                                            changeTaskStatus={this.changeTaskStatus.bind(this)}
                                            setTaskComment={this.setTaskComment.bind(this)}
                                            searchresults={this.state.searchresults}
                                            staff={state.staff}
                                            jobtypes={state.jobTypes}
                                            login={state.user.login}
                                            mainUrl={`${state.user.urlMethod}${state.user.url}`}
                                            rights={state.rights}
                                            activeSlideIndex={this.state.activeSlideIndex}
                                        />
                                    </GestureRecognizer>
                            }
                            {!!(userTasks && userTasks.data && userTasks.data.length && this.state.activeSlideIndex === 0) && (
                                <Sort sort={state.userTasks.sort}
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
    },
    datePickerText: {
        marginRight: 5, fontSize: 13
    }
});

MainScreen = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(MainScreen);

MainScreen.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};
