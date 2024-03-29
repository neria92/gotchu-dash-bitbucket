
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
            fixed: project.fixed,
            language: project.language,
            locationName: { es: project.locationNameES },
            locationPoints: { es: project.locationPointsES },
            missionType: { es: project.missionTypeES },
            objective: { es: project.objetiveES },
            reward: { GP: project.rewardGP },
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

export const editUser = (info) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        //make asyn call

        const firestore = getFirestore();

        firestore.collection('users').doc(info.userID).update(
            info.user
        ).then(function() {
            dispatch({
                type: 'User_Saved',
                payload: {
                    id: info.userID
                }
            });
        }).catch((err) => {
            dispatch({ type: 'User_Saved_Error', err });
        })
    }
};

export const resetMoney = (info) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        //make asyn call

        const firestore = getFirestore();

        firestore.collection('users').doc(info.userID).update(
           {money: 0}
        ).then(function () {
            dispatch({
                type: 'User_Saved',
                payload: {
                    id: info.userID
                }
            });
        }).catch((err) => {
            dispatch({ type: 'User_Saved_Error', err });
        })
    }
};

export const loadLoggedUserData = (uid) => {
   // console.log("aqui si")
    //console.log(uid)
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        //console.log("aqui no")
        const firestore = getFirestore();
        
        firestore.collection('users').doc(uid).get().then(function (doc) {
            //console.log(uid)
            if (doc.exists) {
                //console.log("Document data:", doc.data());
                dispatch({
                    type: 'User_Loaded',
                    payload: {
                        user: doc.data()
                    }
                });
            } else {
                console.log("No user found on DB.");
                var err = "No user found on DB."
                dispatch({ type: 'User_Loaded_Error', err });
            }
        }).catch((err) => {
            console.log("error:" + err)
            dispatch({ type: 'User_Loaded_Error', err });
        })
    }
};