import authReducer from './authReducer'
import projectReducer from './projectReducer'
import { combineReducers } from 'redux'
import {firestoreReducer} from 'redux-firestore'
import {firebaseReducer} from 'react-redux-firebase'
import geoReducer from './geoReducer';
import serverReducer from './serverReducer';
import userReducer from './userReducer';
import pageReducer from './pageReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    projectReducer: projectReducer,
    userReducer, userReducer,
    geo: geoReducer,
    server: serverReducer,
    page: pageReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
});

export default rootReducer