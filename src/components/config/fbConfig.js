import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/functions'

//production
var firebaseConfig = {
  apiKey: "AIzaSyCkd6L4-_sN73EXBq5eVsEv0JJmafVEfio",
  authDomain: "gchgame.fireb=aseapp.com",
  databaseURL: "https://gchgame.firebaseio.com",
  projectId: "gchgame",
  storageBucket: "gchgame.appspot.com",
  messagingSenderId: "795495414711",
  appId: "1:795495414711:web:07f6c1a2b1ebe0c7"
};

//dev2
// var firebaseConfig = {
//   apiKey: "AIzaSyCiRAy0IhRDl1TZbFQyIbO1L6c_8x1tLVc",
//   authDomain: "gchgamedev2.firebaseapp.com",
//   databaseURL: "https://gchgamedev2.firebaseio.com",
//   projectId: "gchgamedev2",
//   storageBucket: "gchgamedev2.appspot.com",
//   messagingSenderId: "1059113189552",
//   appId: "1:1059113189552:web:f10869b074b977885a7b75",
//   measurementId: "G-GY0CFBD0K3"
// };

export var cloudFunctionsURL = "https://us-central1-gchgame.cloudfunctions.net"

  firebase.initializeApp(firebaseConfig);
  firebase.functions()

  export default firebase;