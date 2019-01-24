import React from 'react';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text } from 'react-native';
import { ChangeAdmin } from '../../containers/ChangeAdmin';
import CookieManager from 'react-native-cookies';
import { loggedIn } from '../../actions/fetchLoggedIn';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';

export class Header extends React.Component {
    _logOut() {
        const { dispatch } = this.props;
        CookieManager.clearAll().then(() => {dispatch(loggedIn(false));});
    }

    render() {
        const { state, openDrawer } = this.props;
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: 'rgba(81, 138, 201, 1)', borderBottomWidth: 2, padding: 5, backgroundColor: '#f5f5f5'}}>
                <Button onPress={openDrawer}>
                    <Icon name='bars' size={32} color='rgba(81, 138, 201, 1)'/>
                </Button>
                {(!!state.messages && !!state.messages.undoneTasks && !!state.messages.undoneTasks.length) && (
                    <View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 30, left: 40, backgroundColor: '#f11', borderRadius: 10}}>
                        <Text style={{color: '#fff', fontSize: 12, fontWeight: '500', paddingLeft: 6, paddingRight: 6, paddingTop: 1, paddingBottom: 1}}>{state.messages.undoneTasks.length}</Text>
                    </View>
                )}
                <ChangeAdmin username={state.user.userName} _logOut={this._logOut.bind(this)}/>
            </View>
        );
    }
}

Header = connect(
    state => ({state}),
    dispatch => ({dispatch})
)(Header);

Header.propTypes = {
    state: PropTypes.object,
    dispatch: PropTypes.func,
    openDrawer: PropTypes.func
};
