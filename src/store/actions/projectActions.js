import getLocation from '../actions/geoActions'
import { debug } from 'util';

// // mas bien createCapture
// export const createProject = (project) =>{
//     return (dispatch,getState,{getFirebase,getFirestore}) => {

//         //make asyn call

//         const time = getFirebase().database.ServerValue.TIMESTAMP
//         const firestore = getFirestore();
//         const profile = getState().firebase.profile;
//         const authorId = getState().firebase.auth.uid;
//         const data = {
//             StartDate: new Date(),
//             EndDate: new Date(),
//             id:  authorId,
//             url : project.url
//         }

//         firestore.collection('capture').add({
//             createdAt:  new Date(),
//              userId: authorId,
//             coords: {
//                 lat: null,
//                 long: null
//             },
//             mission: project.missionID
//        }).then( ref => {
//             dispatch({type: 'CREATE_PROJECT',
//             payload: {
//                 id: ref.id
//             }});
//             dispatch(getLocation(ref.id,project.km,project.missionID,data));
//         }).catch((err) =>{
//             dispatch({ type: 'CREATE_PROJECT_ERROR', err});
//         })
        
//     }
// };

// mas bien createCapture
export const createProject = (project) =>{
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

export const editProject = (project) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        //make asyn call

        const firestore = getFirestore();

        firestore.collection('missions').doc(project.missionID).update({
            antecedentes: project.st.antecedentes,
            complejidad: project.st.complejidad,
            mision: project.st.mision,
            radio: project.st.radio,
            recompensa: project.st.recompensa,
            tipo: project.st.tipo,
            title: project.st.title,
            ubicacionNombre: project.st.ubicacionNombre,
        }).then(ref => {
            dispatch({
                type: 'EDIT_PROJECT',
                payload: {
                    id: ref.id
                }
            });
        }).catch((err) => {
            dispatch({ type: 'EDIT_PROJECT_ERROR', err });
        })

    }
};

export const newProject = (project) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        //make asyn call

        const firestore = getFirestore();

        firestore.collection('missions').doc(project.missionID).update({
            antecedentes: project.st.antecedentes,
            complejidad: project.st.complejidad,
            mision: project.st.mision,
            radio: project.st.radio,
            recompensa: project.st.recompensa,
            tipo: project.st.tipo,
            title: project.st.title,
            ubicacionNombre: project.st.ubicacionNombre,
        }).then(ref => {
            dispatch({
                type: 'EDIT_PROJECT',
                payload: {
                    id: ref.id
                }
            });
        }).catch((err) => {
            dispatch({ type: 'EDIT_PROJECT_ERROR', err });
        })

    }
};

