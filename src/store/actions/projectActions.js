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
        firestore.collection('missions').add({
            complexity: { es: project.complexityES },
            description: { es: project.descriptionES },
            durationSecs: project.durationSecs,
            evidenceType: project.evidenceType,
            image0: project.image0,
            image1: project.image1,
            image1: project.image2,
            language: project.language,
            locationName: { es: project.locationNameES },
            locationPoints: [{ coord: { lat: project.locationPoint0Lat, long: project.locationPoint0Long }, radius: project.locationPoint0Radius}],
            missionType: { es: project.missionTypeES },
            objective: { es: project.objetiveES },
            reward: { QP: project.rewardGP },
            startDate: project.startDate,
            title: { es: project.titleES },
            type: project.type
        }).then( ref => {
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

export const editProject = (project) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        //make asyn call

        const firestore = getFirestore();

        firestore.collection('missions').doc(project.missionID).update({
            complexity: { es: project.st.complexityES},
            description: { es: project.st.descriptionES},
            durationSecs: project.st.durationSecs,
            evidenceType: project.st.evidenceType,
            image0: project.st.image0,
            image1: project.st.image1,
            image1: project.st.image2,
            language: project.st.language,
            locationName: { es: project.st.locationNameES },
            locationPoints: [{ coord: { lat: project.st.locationPoint0Lat, long: project.st.locationPoint0Long }, radius: project.st.locationPoint0Radius }],
            missionType: { es: project.st.missionTypeES },
            objetive: { es: project.st.objetiveES},
            reward: { QP: project.st.rewardGP},
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
            dispatch({ type: 'Project_Saved_Error', err });
        })

    }
};