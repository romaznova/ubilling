import React from 'react';
import { View } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';
import { DrawerNavigator } from './DrawerNavigator';
import moment from 'moment';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import {requestTasks} from '../../actions/tasks';
import {requestAllTasks} from '../../actions/allTasks';
import {requestCashTypes} from '../../actions/cashtypes';

export class MainApp extends React.Component {
    state = {
        snackbarVisible: false
    }

    componentDidMount() {
        const { state, dispatch } = this.props;
        const date = moment().format('YYYY-MM-DD');
        dispatch(requestTasks(state, date));
        dispatch(requestAllTasks(state, date, 'all'));
        dispatch(requestCashTypes(state));
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <DrawerNavigator/>
                <Portal>
                    <Snackbar visible={this.state.snackbarVisible}
                        onDismiss={() => {this.setState({snackbarVisible: false});}}
                        action={{label: 'OK', onPress: () => {this.setState({snackbarVisible: false});}}}
                    >
                        У Вас пояивились новые задачи на {moment().format('DD MMMM YYYY')}. Перейдите в раздел "Мои Заявки"
                    </Snackbar>
                </Portal>
            </View>
        );
    }
}

MainApp = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(MainApp);


MainApp.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func
};


