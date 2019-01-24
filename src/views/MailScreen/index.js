import React from 'react';
import { View, ScrollView, ImageBackground, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import connect from 'react-redux/es/connect/connect';
import qs from 'qs';
import _ from 'lodash';
import { UndoneUserTask } from './UndoneUserTask';
import { setUndoneTasks } from '../../actions/messages';
import { Logo } from '../../containers/Logo';
import { Preloader } from '../../containers/Preloader';
import { Header } from '../../components/Header';
import PropTypes from 'prop-types';
import { modifyTask, modifyTaskStatus, setTaskComment } from '../../actions/tasks';

export class MailScreen extends React.Component {

    state = {
        isOnSearching: false
    }

    static navigationOptions = {
        drawerIcon: (
            <Icon name='comment' size={22} color='rgba(81, 138, 201, 1)'/>
        ),
        title: 'ОПОВЕЩЕНИЯ'
    }

    getUndoneTask() {
        const { state, dispatch } = this.props;
        dispatch(setUndoneTasks(state));
    }

    changeTask(e, callback) {
        const { state, dispatch } = this.props;
        const data = qs.stringify({taskid: e.id, modifystarttime: e.starttime, modifystartdate: e.startdate, modifytaskaddress: e.address, modifytaskphone: e.phone || e.mobile, modifytaskjobtype: e.jobtype, modifytaskemployee: e.employee, modifytaskjobnote: e.jobnote});
        dispatch(modifyTask(state, data));
        if (callback) {
            callback();
        }
    }

    changeTaskStatus(data) {
        const { state, dispatch } = this.props;
        dispatch(modifyTaskStatus(state, qs.stringify(data)));
    }

    _renderUndoneTasks() {
        const { state } = this.props;
        return _.map(state.messages.undoneTasks, element => {
            console.log({id: element.id});
            return (<UndoneUserTask element={element}
                key={element.id}
                jobtypes={state.jobTypes}
                staff={state.staff}
                login={state.user.login}
                mainUrl={`${state.user.urlMethod}${state.user.url}`}
                changeTaskStatus={this.changeTaskStatus.bind(this)}
                changeTask={this.changeTask.bind(this)}
                getUndoneTask={this.getUndoneTask.bind(this)}
                setTaskComment={this.setTaskComment.bind(this)}
                rightsChangeDate={state.rights.TASKMANDATE && state.rights.TASKMANDATE.rights}
                rightsChangeTaskStatus={state.rights.TASKMANDONE && state.rights.TASKMANDONE.rights}
                rightsChangeTaskStatusDoneDate={state.rights.TASKMANNODONDATE && state.rights.TASKMANNODONDATE.rights}
            />);
        });
    }

    setTaskComment(id, comment) {
        const { state, dispatch } = this.props;
        const data = qs.stringify({taskid: id, newcommentstext: comment});
        dispatch(setTaskComment(state, data));
    }

    componentDidMount() {
        this.getUndoneTask();
    }

    render() {
        const { state } = this.props;
        return(
            <View style={{flex: 1, backgroundColor: '#F5FCFF'}}>
                <Header openDrawer={this.props.navigation.openDrawer}/>
                <View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,1)', margin: 10, padding: 5, shadowColor: '#000',
                            shadowOffset: { width: 1, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 4,
                            elevation: 2}}>
                            <Text style={{fontSize: 15}}>
                                Всего оповещений: <Text style={{fontSize: 16, fontWeight: '500', color: 'rgba(81, 138, 201, 1)'}}>{state.messages.undoneTasks.length || 0}</Text>
                            </Text>
                            <TouchableOpacity style={{marginRight: 10}} onPress={() => {this.getUndoneTask();}}>
                                {state.messages.isFetching && (state.messages.undoneTasks && state.messages.undoneTasks.length)
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
                        {state.messages.isFetching && !(state.messages.undoneTasks && state.messages.undoneTasks.length)
                            ?
                            (<View style={{flex: 1, justifyContent: 'center'}}>
                                <Logo/>
                                <Preloader text='Идёт поиск заявок'/>
                            </View>)
                            :
                            (<ScrollView style={{flex: 1}}>
                                {this._renderUndoneTasks()}
                            </ScrollView>)}
                    </View>
                </View>
            </View>
        );
    }
}

MailScreen = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(MailScreen);

MailScreen.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};
