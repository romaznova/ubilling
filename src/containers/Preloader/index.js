import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import PropTypes from 'prop-types';

export class Preloader extends React.Component{
    render() {
        const { text } = this.props;
        return (
            <View>
                <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 15}}>{text}</Text>
                <ActivityIndicator color='#518AC9' size={50}/>
            </View>
        );
    }
}

Preloader.propTypes = {
    text: PropTypes.string
};
