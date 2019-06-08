import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: false};

const config = {
    apiKey: "AIzaSyCqhiF35fZehrPFUAm89OuRVCHQp-Vg0Pk",
    authDomain: "istec-444ca.firebaseapp.com",
    databaseURL: "https://istec-444ca.firebaseio.com",
    projectId: "istec-444ca",
    storageBucket: "istec-444ca.appspot.com",
    messagingSenderId: "740386630062",
    appId: "1:740386630062:web:f57ebe8488b3df0b"
};
const app = firebase.initializeApp(config);
console.log({app});
// const db = app.database();
// db.ref('/items').push({
//     name: 'item'
// });
// // firebase.firestore().settings(settings);
// console.log({db});
export default firebase;
