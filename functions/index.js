const functions = requiere('firebase-functions');
const admin = requiere('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
    //get user and add custom claim (admin)
    return admin.auth().getUser(data.uid).then(user => {
        return admin.auth.setCustomUserClaims(user.uid, {
            admin: true
        });
    }).then(() => {
        return {
            message: 'Success admin role added'
        }
    }).catch(err => {
        return err;
    });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

