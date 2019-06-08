import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';

const configure = () => {
    PushNotification.configure({

        onRegister: function(token) {
            //process token
            console.log( 'TOKEN:', token );
        },

        onNotification: function(notification) {
            // process the notification
            // required on iOS only
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        popInitialNotification: true,
        requestPermissions: true,
        largeIcon: "ic_launcher",
        smallIcon: "ic_notification"

    });
};

const localNotification = element => {
    configure();
    PushNotification.localNotification({
        id: '1',
        autoCancel: true,
        bigText: '1',
        subText: '1',
        // color: "transparent",
        vibrate: true,
        vibration: 300,
        title: '1',
        message: '1',
        playSound: true,
        soundName: 'default'
    });
};

export {
    configure,
    localNotification,
};
