import getLocation from '../actions/geoActions'
import { debug } from 'util';

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

