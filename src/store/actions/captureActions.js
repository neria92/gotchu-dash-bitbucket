import getLocation from '../actions/geoActions'
import { debug } from 'util';

// mas bien createCapture
export const createProject = (project) =>{
    return (dispatch,getState,{getFirebase,getFirestore}) => {

        //make asyn call

        const time = getFirebase().database.ServerValue.TIMESTAMP
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        const data = {
            StartDate: new Date(),
            EndDate: new Date(),
            id:  authorId,
            url : project.url
        }

        firestore.collection('capture').add({
            createdAt:  new Date(),
             userId: authorId,
            coords: {
                lat: null,
                long: null
            },
            mission: project.missionID
       }).then( ref => {
            dispatch({type: 'CREATE_PROJECT',
            payload: {
                id: ref.id
            }});
            dispatch(getLocation(ref.id,project.km,project.missionID,data));
        }).catch((err) =>{
            dispatch({ type: 'CREATE_PROJECT_ERROR', err});
        })
        
    }
};

export const addProject = (project) =>{
    return (dispatch,getState,{getFirebase,getFirestore}) => {

        //make asyn call
        const firestore = getFirestore();
        firestore.collection('missions').add(project).then( ref => {
            dispatch({type: 'Project_Added',
            payload: {
                id: ref.id
            }});
            //dispatch(getLocation(ref.id,project.km,project.missionID,data));
        }).catch((err) =>{
            dispatch({ type: 'Project_Added_Error', err});
        })
        
    }
};

// mas bien createCapture
export const deleteProject = (project) =>{
    return (dispatch,getState,{getFirebase,getFirestore}) => {

        //make asyn call
        const firestore = getFirestore();
        firestore.collection('missions').doc(project).delete().then( function() {
            dispatch({type: 'Project_Deleted',
            payload: {
                id: project
            }});
            //dispatch(getLocation(ref.id,project.km,project.missionID,data));
        }).catch((err) =>{
            dispatch({ type: 'Project_Deleted_Error', err});
        })
        
    }
};

export const editCapture = (captureID,capture) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        //make asyn call

        const firestore = getFirestore();

        firestore.collection('capture').doc(captureID).update(
            capture
        ).then(function() {
            dispatch({
                type: 'Capture_Saved',
                payload: {
                    id: captureID
                }
            });
        }).catch((err) => {
            dispatch({ type: 'Capture_Saved_Error', err });
        })

    }
};

export const deleteCapture = (capture) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        //make asyn call
        const firestore = getFirestore();
        firestore.collection('capture').doc(capture).delete().then(function () {
            dispatch({
                type: 'Capture_Deleted',
                payload: {
                    id: capture
                }
            });
            //dispatch(getLocation(ref.id,project.km,project.missionID,data));
        }).catch((err) => {
            dispatch({ type: 'Capture_Deleted_Error', err });
        })
    }
};

export const showOnlyPending = (sop) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            type: 'Show_Only_Pending',
            payload: {
                showOnlyPending: sop
            }
        });
    }
};

export const showOnlyAccepted = (soa) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            type: 'Show_Only_Accepted',
            payload: {
                showOnlyAccepted: soa
            }
        });
    }
};

export const showOnlyRejected = (sor) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            type: 'Show_Only_Rejected',
            payload: {
                showOnlyRejected: sor
            }
        });
    }
};

export const orderByReports = (obr) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            type: 'Order_By_Reports',
            payload: {
                orderByReports: obr
            }
        });
    }
};