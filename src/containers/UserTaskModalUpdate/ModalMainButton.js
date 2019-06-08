import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-paper';
import PropTypes from 'prop-types';
import i18n from '../../services/i18n';

export class ModalMainButton extends React.Component {
    render() {
        const { editable, _enableEditTask, _disableEditTask, _resetElementStateToDefault, changeTask, element } = this.props;
        if (editable) {
            return (
                <View style={{flexDirection: 'row', marginTop: 2}}>
                    <TouchableOpacity style={{flex: 1, marginRight: 2}} onPress={() => {changeTask(element); _disableEditTask();}}>
                        <Button mode='contained' dark={true} style={{backgroundColor: '#00a600'}}>{i18n.t('save')}</Button>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{flex: 1, marginLeft: 2}} onPress={() => {_resetElementStateToDefault(_disableEditTask);}}>
                        <Button mode='contained' dark={true} style={{backgroundColor: '#ed6f5b'}}>{i18n.t('cancel')}</Button>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <TouchableOpacity onPress={_enableEditTask} style={{marginTop: 2}}>
                    <Button mode='contained' dark={true}>{i18n.t('edit')}</Button>
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
