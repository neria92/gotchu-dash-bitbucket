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

// export const addMultipleProjects = (projects) => {
//     return (dispatch, getState, { getFirebase, getFirestore }) => {

//         const size = projects.length;
//         for (var i = 0; i < size; i++) {
//             const firestore = getFirestore();
//             console.log(projects[i])
//             firestore.collection('missions').add(projects[i]);
//         }
//     }
// };

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

export const editProject = (missionID,project) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        //make asyn call

        const firestore = getFirestore();

        firestore.collection('missions').doc(missionID).update(
            project
        ).then(function() {
            dispatch({
                type: 'Project_Saved',
                payload: {
                    id: missionID
                }
            });
        }).catch((err) => {
            dispatch({ type: 'Project_Saved_Error', err });
        })

    }
};

export const setSearchString = (searchString) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            type: 'set_Search_String',
            payload: {
                searchString: searchString
            }
        });
    }
};

export const setOrderByReports = (obr) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            type: 'set_Order_By_Reports',
            payload: {
                orderByReports: obr
            }
        });
    }
};

export const setStartDate = (startDate) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            type: 'set_Start_Date',
            payload: {
                startDate: startDate
            }
        });
    }
};

export const setStartDateChecked = (startDateChecked) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        dispatch({
            type: 'set_Start_Date_Checked',
            payload: {
                startDateChecked: startDateChecked
            }
        });
    }
};