import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/functions'

var firebaseConfig = {
  apiKey: "AIzaSyCiRAy0IhRDl1TZbFQyIbO1L6c_8x1tLVc",
  authDomain: "gchgamedev2.firebaseapp.com",
  databaseURL: "https://gchgamedev2.firebaseio.com",
  projectId: "gchgamedev2",
  storageBucket: "gchgamedev2.appspot.com",
  messagingSenderId: "1059113189552",
  appId: "1:1059113189552:web:f10869b074b977885a7b75",
  measurementId: "G-GY0CFBD0K3"
};

  firebase.initializeApp(firebaseConfig);
  firebase.functions()

  export default firebase;