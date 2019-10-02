const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
    return admin.auth().setCustomUserClaims(data.uid, {
        admin: true
    }).then(() => {
        return {
            message: 'Usuario asignado a administrador con exito.'
        }
    }).catch(err => {
        return {
            error: err
        }
    });
});