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
            dispatch({type: 'CREATE_PROJECT',
            payload: {
                id: ref.id
            }});
            //dispatch(getLocation(ref.id,project.km,project.missionID,data));
        }).catch((err) =>{
            dispatch({ type: 'CREATE_PROJECT_ERROR', err});
        })
        
    }
};

// mas bien createCapture
export const deleteProject = (project) =>{
    return (dispatch,getState,{getFirebase,getFirestore}) => {

        //make asyn call
        const firestore = getFirestore();
        firestore.collection('missions').doc(project).delete().then( ref => {
            dispatch({type: 'DELETE_PROJECT',
            payload: {
                id: ref.id
            }});
            //dispatch(getLocation(ref.id,project.km,project.missionID,data));
        }).catch((err) =>{
            dispatch({ type: 'DELETE_PROJECT_ERROR', err});
        })
        
    }
};

export const editProject = (project) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        //make asyn call

        const firestore = getFirestore();

        firestore.collection('missions').doc(project.missionID).update({
            complexity: { es: project.st.complexityES},
            description: { es: project.st.descriptionES},
            durationSecs: project.st.durationSecs,
            fixed: project.st.fixed,
            language: project.st.language,
            locationName: { es: project.st.locationNameES },
            locationPoints: { es: project.st.locationPointsES},
            missionType: { es: project.st.missionTypeES },
            objetive: { es: project.st.objetiveES},
            reward: { GP: project.st.rewardGP},
            startDate: project.st.startDate,
            title: { es: project.st.titleES},
            type: project.st.type
        }).then(function() {
            dispatch({
                type: 'Project_Saved',
                payload: {
                    id: project.missionID
                }
            });
        }).catch((err) => {
            dispatch({ type: 'EDIT_PROJECT_ERROR', err });
        })

    }
};