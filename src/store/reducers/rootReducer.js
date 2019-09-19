import authReducer from './authReducer'
import projectReducer from './projectReducer'
import { combineReducers } from 'redux'
import {firestoreReducer} from 'redux-firestore'
import {firebaseReducer} from 'react-redux-firebase'
import geoReducer from './geoReducer';
import serverReducer from './serverReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    project: projectReducer,
    geo: geoReducer,
    server: serverReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
});

export default rootReducer