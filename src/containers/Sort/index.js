import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import PropTypes from 'prop-types';

export class Sort extends React.Component {
    render() {
        const { sort, sortTasksByAddress, sortTasksByTime, sortTasksByStatus } = this.props;
        return(
            <View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={sortTasksByAddress} style={[styles.swiperRow, {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: sort.address ? 'rgba(81, 138, 201, 1)' : 'rgba(255, 255, 255, 1)', margin: 5, borderRadius: 2, height: 50}]}>
                        <Icon name='map' size={35} color={sort.address ? 'rgba(255, 255, 255, 0.9)' : 'rgba(81, 138, 201, 1)'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={sortTasksByTime} style={[styles.swiperRow, {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: sort.time ? 'rgba(81, 138, 201, 1)' : 'rgba(255, 255, 255, 1)', margin: 5, borderRadius: 2, height: 50}]}>
                        <Icon name='clock-o' size={35} color={sort.time ? 'rgba(255, 255, 255, 0.9)' : 'rgba(81, 138, 201, 1)'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={sortTasksByStatus} style={[styles.swiperRow, {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: sort.status ? 'rgba(81, 138, 201, 1)' : 'rgba(255, 255, 255, 1)', margin: 5, borderRadius: 2, height: 50}]}>
                        <Icon name='retweet' size={35} color={sort.status ? 'rgba(255, 255, 255, 0.9)' : 'rgba(81, 138, 201, 1)'}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

Sort.propTypes = {
    sort: PropTypes.object,
    sortTasksByAddress: PropTypes.func,
    sortTasksByTime: PropTypes.func,
    sortTasksByStatus: PropTypes.func
};
