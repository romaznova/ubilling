import React from 'react';
import {View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import PropTypes from 'prop-types';

export class EditableField extends React.Component {
    render() {
        const { label, value, editable, _changeElement } = this.props;
        if (editable) {
            return (
                <View style={{marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                    <TextInput value={value}
                        style={{backgroundColor: 'rgba(81, 138, 201, 0.1)'}}
                        label={label}
                        multiline={true}
                        onChangeText={text => {_changeElement(text);}}
                    />
                </View>
            );
        } else {
            return (
                <View style={{marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                    <Text>{label}</Text>
                    <Text style={{fontSize: 16, fontWeight: '500'}}>{value}</Text>
                </View>
            );
        }
    }
}

EditableField.propTypes = {
    editable: PropTypes.bool,
    label: PropTypes. string,
    value: PropTypes.string,
    _changeElement: PropTypes.func
};
