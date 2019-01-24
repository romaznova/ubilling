import React from 'react';
import { View } from 'react-native';
import { Text, Title} from 'react-native-paper';
import _ from 'lodash';
import PropTypes from 'prop-types';

export class Rights extends React.Component {

    _renderRights() {
        const { rights } = this.props;
        return _.map(rights, (element, index) => {
            if (element.rights) {
                return (
                    <View key={index} style={{marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                        <Text style={{fontSize: 15}}>{element.desc}</Text>
                    </View>
                );
            }
        });
    }

    render() {
        return (
            <View style={{marginBottom: 3, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>
                <Title style={{marginBottom: 2, padding: 5, textAlign: 'center'}}>Ваши права</Title>
                {this._renderRights()}
                <Text style={{marginBottom: 2, padding: 5, backgroundColor: 'rgba(81, 138, 201, 0.1)'}}>Обратитесь к вашему системному администратору для расширения прав</Text>
            </View>
        );
    }
}

Rights.propTypes = {
    rights: PropTypes.object
};

