import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Text, Title, Checkbox, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import { UserTask } from './UserTask';
import PropTypes from 'prop-types';

export class UserTasksList extends React.Component {
    _renderItems() {
        const { tasks, sort, tasksDate, changeTask, changeTaskStatus, renderResults, staff, jobtypes, login, employee, mainUrl, rights, activeSlideIndex, setTaskComment } = this.props;
        const renderLength = 20;
        const employeesCurrentTasks = _.filter(tasks, _.matches({employee}));
        let employeesTasks;
        if (!!activeSlideIndex) {
            employeesTasks = tasks;
        } else employeesTasks = !employee ? tasks : !!employeesCurrentTasks ? employeesCurrentTasks : [];
        if (employeesTasks && employeesTasks.length) {
            const sortedTasks = _.sortBy(employeesTasks, [
                sort.status && 'status',
                sort.time && 'starttime',
                sort.address && 'address'
            ]);
            return _.map(sortedTasks.slice(0, renderLength * renderResults), (element, index) => {
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
                              employee={employee}
                              mainUrl={mainUrl}
                              rights={rights}
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
        const { tasks, employee, renderResults, setRenderCounter, activeSlideIndex, rights } =  this.props;
        const employeesTasks = !employee ? tasks : _.filter(tasks, _.matches({employee}));
        return rights.TASKMAN && rights.TASKMAN.rights
            ?
                <View style={{flex: 1}}>
                    {(!!employeesTasks && !!employeesTasks.length) && (
                        <View style={{backgroundColor: 'rgba(255,255,255,1)', marginLeft: 5, marginRight: 5, marginBottom: 5, shadowColor: '#000',
                            shadowOffset: { width: 1, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 4,
                            elevation: 2}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 14}}>Всего заявок: </Text>
                                    <Text style={{fontSize: 16, fontWeight: '500', color: 'rgba(81, 138, 201, 1)'}}>{employeesTasks.length}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    <ScrollView style={{flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)'}} overScrollMode='always'>
                        {this._renderItems()}
                        {(!!(employeesTasks && employeesTasks.length && employeesTasks.length > renderResults * 20)
                            || (!!activeSlideIndex && tasks.length > renderResults * 20)) && (
                            <TouchableOpacity onPress={setRenderCounter}>
                                <Button dark={true} mode='contained' style={{margin: 5}}>Показать ещё</Button>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>
            :
                <View style={{flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center'}}>
                    <Text style={{fontSize: 16, textAlign: 'center', margin: 40}}>У Вас нет прав для просмтора контента. Обратитесь к Вашему системному администратору</Text>
                </View>
    }
}

UserTasksList.propTypes = {
    employee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    jobtypes: PropTypes.objectOf(PropTypes.string),
    login: PropTypes.string,
    mainUrl: PropTypes.string,
    rights: PropTypes.object,
    sort: PropTypes.objectOf(PropTypes.bool),
    staff: PropTypes.object,
    tasks: PropTypes.array,
    tasksDate: PropTypes.string,
    activeSlideIndex: PropTypes.number,
    renderResults: PropTypes.number,
    changeTask: PropTypes.func,
    changeTaskStatus: PropTypes.func,
    sortTasksByStatus: PropTypes.func,
    sortTasksByTime: PropTypes.func,
    sortTasksByAddress: PropTypes.func,
    setTaskComment: PropTypes.func,
    setRenderCounter: PropTypes.func
};

