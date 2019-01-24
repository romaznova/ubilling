import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-paper';
import PropTypes from 'prop-types';

export class ModalMainButton extends React.Component {
    render() {
        const { editable, _enableEditTask, _disableEditTask, _resetElementStateToDefault, changeTask, element } = this.props;
        if (editable) {
            return (
                <View style={{flexDirection: 'row', marginTop: 2}}>
                    <TouchableOpacity style={{flex: 1, marginRight: 2}} onPress={() => {changeTask(element); _disableEditTask();}}>
                        <Button mode='contained' dark={true} style={{backgroundColor: '#00a600'}}>Сохранить</Button>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{flex: 1, marginLeft: 2}} onPress={() => {_resetElementStateToDefault(_disableEditTask);}}>
                        <Button mode='contained' dark={true} style={{backgroundColor: '#ed6f5b'}}>Отмена</Button>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <TouchableOpacity onPress={_enableEditTask} style={{marginTop: 2}}>
                    <Button mode='contained' dark={true}>Редактировать</Button>
                </TouchableOpacity>
            );
        }
    }
}

ModalMainButton.propTypes = {
    editable: PropTypes.bool,
    element: PropTypes.object,
    changeTask: PropTypes.func,
    _disableEditTask: PropTypes.func,
    _enableEditTask: PropTypes.func,
    _resetElementStateToDefault: PropTypes.func
};
