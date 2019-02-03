import React from 'react';
import {StyleSheet, View} from 'react-native';
import { Text, Title} from 'react-native-paper';
import _ from 'lodash';
import PropTypes from 'prop-types';

export class Rights extends React.Component {

    _renderRights() {
        const { rights } = this.props;
        return _.map(rights, (element, index) => {
            if (element.rights) {
                return (
                    <View key={index} style={[styles.additionalSpace, styles.background]}>
                        <Text style={styles.regularFontSize}>{element.desc}</Text>
                    </View>
                );
            }
        });
    }

    render() {
        return (
            <View style={[styles.additionalSpace, styles.background]}>
                <Title style={[styles.additionalSpace, {textAlign: 'center'}]}>Ваши права</Title>
                {this._renderRights()}
                <Text style={[styles.additionalSpace, styles.background]}>Обратитесь к вашему системному администратору для расширения прав</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    additionalSpace: {
        marginBottom: 2, padding: 5
    },
    background: {
        backgroundColor: 'rgba(81, 138, 201, 0.1)'
    },
    regularFontSize: {
        fontSize: 15
    }
});

Rights.propTypes = {
    rights: PropTypes.object
};

