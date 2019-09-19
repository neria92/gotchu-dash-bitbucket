import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyCkd6L4-_sN73EXBq5eVsEv0JJmafVEfio",
    authDomain: "gchgame.firebaseapp.com",
    databaseURL: "https://gchgame.firebaseio.com",
    projectId: "gchgame",
    storageBucket: "gchgame.appspot.com",
    messagingSenderId: "795495414711",
    appId: "1:795495414711:web:07f6c1a2b1ebe0c7"

  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;