import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Text, Title, Checkbox, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import { UserTask } from './UserTask';
import PropTypes from 'prop-types';

export class UserTasksList extends React.Component {

    _renderItems(tasks) {
        const { tasksDate, changeTask, changeTaskStatus, staff, jobtypes, login, mainUrl, rightsChangeDate, rightsChangeTaskStatus, rightsChangeTaskStatusDoneDate, activeSlideIndex, setTaskComment } = this.props;
        if (tasks && tasks.length) {
            return _.map(tasks, (element, index) => {
                return (
                    <UserTask key={element.id}
                        element={element}
                        index={index}
                        changeTask={changeTask}
                        changeTaskStatus={changeTaskStatus}
                        setTaskComment={setTaskComment}
                        staff={staff}
                        jobtypes={jobtypes}
                        login={login}
                        tasksDate={tasksDate}
                        mainUrl={mainUrl}
                        rightsChangeDate={rightsChangeDate}
                        rightsChangeTaskStatus={rightsChangeTaskStatus}
                        rightsChangeTaskStatusDoneDate={rightsChangeTaskStatusDoneDate}
                        activeSlideIndex={activeSlideIndex}
                    />
                );
            });
        } else return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name='bath' size={120} color='rgba(81, 138, 201, 0.1)' style={{margin: 30}}/>
                <Text style={{textAlign: 'center', color: 'rgba(81, 138, 201, 1)', margin: 15}}>Не удалось найти ни одной заявки. Попробуйте использовать другие критерии для поиска</Text>
            </View>
        );
    }

    render () {
        const { tasks, rights } =  this.props;
        return rights
            ?
            (
                <View style={{flex: 1}}>
                    {(!!tasks && !!tasks.length) && (
                        <View style={{backgroundColor: 'rgba(255,255,255,1)', marginLeft: 5, marginRight: 5, marginBottom: 5, shadowColor: '#000',
                            shadowOffset: { width: 1, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 4,
                            elevation: 2}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 2, margin: 2}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 14}}>Всего заявок: </Text>
                                    <Text style={{fontSize: 16, fontWeight: '500', color: 'rgba(81, 138, 201, 1)'}}>{tasks.length}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    <ScrollView style={{flex: 1}} overScrollMode='always'>
                        {this._renderItems(tasks)}
                    </ScrollView>
                </View>
            )
            :
            (
                <View style={{flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center'}}>
                    <Text style={{fontSize: 16, textAlign: 'center', margin: 40}}>У Вас нет прав для просмтора контента. Обратитесь к Вашему системному администратору</Text>
                </View>
            );
    }
}

UserTasksList.propTypes = {
    employee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    jobtypes: PropTypes.objectOf(PropTypes.string),
    login: PropTypes.string,
    mainUrl: PropTypes.string,
    rights: PropTypes.bool,
    rightsChangeTaskStatusDoneDate: PropTypes.bool,
    rightsChangeDate: PropTypes.bool,
    rightsChangeTaskStatus: PropTypes.bool,
    sort: PropTypes.objectOf(PropTypes.bool),
    staff: PropTypes.object,
    tasks: PropTypes.array,
    tasksByDateInterval: PropTypes.array,
    tasksDate: PropTypes.string,
    activeSlideIndex: PropTypes.number,
    _changeEmployee: PropTypes.func,
    changeTask: PropTypes.func,
    changeTaskStatus: PropTypes.func,
    sortTasksByStatus: PropTypes.func,
    sortTasksByTime: PropTypes.func,
    sortTasksByAddress: PropTypes.func,
    setTaskComment: PropTypes.func
};
