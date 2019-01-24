import React from 'react';
import { Card, Text, TextInput, Title, Button } from 'react-native-paper';
import { TouchableOpacity, View, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

export class UserTaskModalComments extends React.Component {
    state = {
        comment: ''
    }

    _renderComments() {
        const { element, staff } = this.props;
        if (element.comments && element.comments.length) {
            return _.map(element.comments, (el) => {
                return (
                    <View key={el.id} style={{backgroundColor: '#fff', margin: 4, padding: 2, shadowColor: '#000',
                        shadowOffset: { width: 1, height: 3 },
                        shadowOpacity: 0.8,
                        shadowRadius: 4,
                        elevation: 2}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon name='user' size={20} color='rgba(81, 138, 201, 1)' style={{margin: 5}}/>
                            <Text style={{margin: 2, fontSize: 14, fontWeight: '500'}}>{staff.employees[element.employee]}</Text>
                        </View>
                        <Text style={{margin: 2, fontSize: 12}}>{moment(el.date).format('Do MMMM YYYY в HH:MM')}</Text>
                        <View style={{backgroundColor: '#fff', margin: 4, fontSize: 14, borderRadius: 4, shadowColor: '#000',
                            shadowOffset: { width: 1, height: 3 },
                            shadowOpacity: 0.8,
                            shadowRadius: 4,
                            elevation: 2}}>
                            <Text style={{backgroundColor: 'rgba(81, 138, 201, 0.1)', padding: 5, fontSize: 14}}>{el.text}</Text>
                        </View>
                    </View>
                );
            });
        } else return (<Text style={{fontSize: 18}}>Комментариев нет</Text>);
    }

    render() {
        const { element,  _setModalVisibility, visible, setTaskComment } = this.props;
        return (
            <Modal style={{flex: 1}} visible={visible} animationType='slide' onRequestClose={() => {_setModalVisibility();}}>
                <Card style={{flex: 1, padding: 5, position: 'relative', borderRadius: 0}}>
                    <Card.Content style={{flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4, marginBottom: 4,  borderBottomWidth: 2, borderBottomColor: 'rgba(81, 138, 201, 1)'}}>
                            <TouchableOpacity
                                onPress={() => {_setModalVisibility();}}
                                style={{width: 22}}
                            >
                                <Icon name='reply' size={22} color='rgba(81, 138, 201, 1)'/>
                            </TouchableOpacity>
                            <Title style={{color: 'rgba(81, 138, 201, 1)'}}>Комментарии к заявке</Title>
                            <Icon name='comments-o' size={35} color='rgba(81, 138, 201, 1)'/>
                        </View>
                        <ScrollView style={{flex: 1, marginBottom: 2}}>
                            {this._renderComments()}
                        </ScrollView>
                        <View>
                            <TextInput value={this.state.comment} onChangeText={text => {this.setState({comment: text});}} style={{marginBottom: 5}}/>
                            <TouchableOpacity onPress={() => setTaskComment(element.id, this.state.comment)}>
                                <Button mode='contained' dark={true}>Отправить</Button>
                            </TouchableOpacity>
                        </View>
                    </Card.Content>
                </Card>
            </Modal>
        );
    }
}

UserTaskModalComments.propTypes = {
    element: PropTypes.object,
    staff: PropTypes.object,
    visible: PropTypes.bool,
    _setModalVisibility: PropTypes.func,
    setTaskComment: PropTypes.func
};

