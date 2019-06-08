import BackgroundFetch from "react-native-background-fetch";
import * as pushNotifications from '../pushNotifications/pushNotifications';

export const MyHeadlessTask = async () => {
    BackgroundFetch.configure({
        minimumFetchInterval: 1, // <-- minutes (15 is minimum allowed)
        stopOnTerminate: false,   // <-- Android-only,
        startOnBoot: true         // <-- Android-only
    }, () => {
        console.log("[js] Received background-fetch event");
        // Required: Signal completion of your task to native code
        // If you fail to do this, the OS can terminate your app
        // or assign battery-blame for consuming too much background-time
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
    }, (error) => {
        console.log("[js] RNBackgroundFetch failed to start");
    });

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
        switch(status) {
            case BackgroundFetch.STATUS_RESTRICTED:
                console.log("BackgroundFetch restricted");
                break;
            case BackgroundFetch.STATUS_DENIED:
                console.log("BackgroundFetch denied");
                break;
            case BackgroundFetch.STATUS_AVAILABLE:
                console.log("BackgroundFetch is enabled");
                break;
        }
    });

    // let response = await fetch('https://facebook.github.io/react-native/movies.json').catch(err => console.log({err}));
    // let responseJson = await response.json();
    // console.log('[BackgroundFetch HeadlessTask response: ', responseJson);
    //
    // BackgroundFetch.finish();
}

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

export const findTask = async () => {
    pushNotifications.localNotification();
}
