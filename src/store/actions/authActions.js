export const signIn = (credentials, provider) => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();

        console.log("Credentials -> [" + provider + "]");
        switch (provider) {
            case 'email':
            default:
                firebase.auth().signInWithEmailAndPassword(
                    credentials.email,
                    credentials.password
                ).then(() => {
                    dispatch({ type: 'LOGIN_SUCCESS' })
                }).catch((err) => {
                    dispatch({ type: 'LOGIN_ERROR', err })
                });
                break;
            case 'google':
                var authProvider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(authProvider).then(function (result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    // ...
                    dispatch({ type: 'LOGIN_SUCCESS' });
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                    dispatch({ type: 'DEBUG', msg: 'ERR - ' + errorMessage });
                });
                break;
            case 'facebook':
                var authProvider = new firebase.auth.FacebookAuthProvider();

                ////////// Para redireccionar - para celular. Se tiene que quitar lo demas.
                // firebase.auth().signInWithRedirect(authProvider);
                //////////

                firebase.auth().signInWithPopup(authProvider).then(function (result) {
                    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    // ...
                    dispatch({ type: 'LOGIN_SUCCESS' });
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                    dispatch({ type: 'DEBUG', msg: 'ERR - ' + errorMessage });
                });
                break;
            case 'twitter':
                var authProvider = new firebase.auth.TwitterAuthProvider();

                ////////// Para redireccionar - para celular. Se tiene que quitar lo demas.
                // firebase.auth().signInWithRedirect(authProvider);
                //////////

                firebase.auth().signInWithPopup(authProvider).then(function (result) {
                    // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
                    // You can use these server side with your app's credentials to access the Twitter API.
                    var token = result.credential.accessToken;
                    var secret = result.credential.secret;
                    // The signed-in user info.
                    var user = result.user;
                    // ...
                    dispatch({ type: 'LOGIN_SUCCESS' });
                }).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                    dispatch({ type: 'DEBUG', msg: 'ERR - ' + errorMessage });
                });
                break;
        }
    }
}

export const signOut = () => {
    return (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        firebase.auth().signOut().then(() => {
            dispatch({ type: 'SIGNOUT_SUCCESS' });
        });
    }
}

export const signUp = (newUser) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then((resp) => {
            return firestore.collection('users').doc(resp.user.uid).set({
                firstName: newUser.firstName,
                lastName: newUser.lastName
            })
        }).then(() => {
            dispatch({ type: 'SIGNUP_SUCCESS' })
        }).catch(err => {
            dispatch({ type: 'SIGNUP_ERROR', err })
        })
    }
}

