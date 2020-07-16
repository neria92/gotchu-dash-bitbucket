const functions = require('firebase-functions');
const utils = require('./utils');
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

//Funcion que regresa un arreglo de tamaño a lo mas lengthLimit, con el contenido de las misiones usando la base de datos db. 
//El contenido estara ordenado por sortBy y filtrado con las opciones de filter
// async function getTotalMissions(db) {
//     var queryMissions = db.collection("missions");
//     var result = 0

//     //if (sortBy == "date") {
//         //query = query.orderBy("startDate", "desc");
//     //}

//     //Se regresa una promesa para que todo funcione bien
//     return new Promise((resolve, reject) => {
        
        
//         queryMissions.get().then(function (snapshot) {
//             var totalMissions = 0;
//             var totalCaptures = 0
//             var rmissions = [];
//             var docs = snapshot

//             docs.forEach(function (doc) {
//                 totalMissions++
                
//                 var data = doc.data();
//                 rmissions.push(data);
//                 //     data._id = doc.id;
//                 //     data.contentType = "mission";
//                 //     data.distanceToUser = doc.distanceToUser;
//                 //     var lan = "es";
//                 //     var ok = true;
//             });
//             result = totalMissions
//             return resolve(result);
//         }).catch(function (error) {
//             console.log("Error getting documents: ", error);
//             return reject([]);
//         });
//     });
// }

// async function getLastCaptures(db) {
//     var queryMissions = db.collection("capture");
//     queryMissions = queryMissions.orderBy("createdAt", "asc");
//     var lengthLimit = 10
//     var result = []

//     //if (sortBy == "date") {
//         //query = query.orderBy("startDate", "desc");
//     //}

//     //Se regresa una promesa para que todo funcione bien
//     return new Promise((resolve, reject) => {
//         queryMissions.get().then(function (snapshot) {
//             var finished = false
//             var totalCaptures = 0;
//             var totalCaptures = 0
//             var rcaptures = [];
//             var docs = snapshot

//             docs.forEach(function (doc) {
//                 if (finished) {
//                     return;
//                 }
//                 totalCaptures++
                
//                 var data = doc.data();
//                 rcaptures.push(data);
//                 //     data._id = doc.id;
//                 //     data.contentType = "mission";
//                 //     data.distanceToUser = doc.distanceToUser;
//                 //     var lan = "es";
//                 //     var ok = true;

//                 lengthLimit--;
//                 if (lengthLimit <= 0) {
//                     finished = true;
//                 }
//             });
//             result = rcaptures
//             return resolve(result);
//         }).catch(function (error) {
//             console.log("Error getting documents: ", error);
//             return reject([]);
//         });
//     });
// }

// async function getTotalCaptures(db) {
//     var queryMissions = db.collection("capture");
//     var result = 0

//     //if (sortBy == "date") {
//     //query = query.orderBy("startDate", "desc");
//     //}

//     //Se regresa una promesa para que todo funcione bien
//     return new Promise((resolve, reject) => {


//         queryMissions.get().then(function (snapshot) {
//             var totalCaptures = 0;
//             var totalCaptures = 0
//             var rcaptures = [];
//             var docs = snapshot

//             docs.forEach(function (doc) {
//                 totalCaptures++

//                 var data = doc.data();
//                 rcaptures.push(data);
//                 //     data._id = doc.id;
//                 //     data.contentType = "mission";
//                 //     data.distanceToUser = doc.distanceToUser;
//                 //     var lan = "es";
//                 //     var ok = true;
//             });
//             result = totalCaptures
//             return resolve(result);
//         }).catch(function (error) {
//             console.log("Error getting documents: ", error);
//             return reject([]);
//         });
//     });
// }

// async function getTotalUsers(db) {
//     var queryMissions = db.collection("users");
//     var result = 0

//     //Se regresa una promesa para que todo funcione bien
//     return new Promise((resolve, reject) => {

//         queryMissions.get().then(function (snapshot) {
//             var totalUsers = 0;
//             var docs = snapshot

//             docs.forEach(function (doc) {
//                 totalUsers++
//             });
//             result = totalUsers
//             return resolve(result);
//         }).catch(function (error) {
//             console.log("Error getting documents: ", error);
//             return reject([]);
//         });
//     });
// }

async function getMissions(db) {
    var queryMissions = db.collection("missions");
    queryMissions = queryMissions.orderBy("startDate", "desc");
    var result = []

    //Se regresa una promesa para que todo funcione bien
    return new Promise((resolve, reject) => {

        queryMissions.get().then(function (snapshot) {
            var rmissions = [];
            var docs = snapshot

            docs.forEach(function (doc) {

                var data = doc.data();
                rmissions.push(data);
                //     data._id = doc.id;
                //     data.contentType = "mission";
                //     data.distanceToUser = doc.distanceToUser;
                //     var lan = "es";
                //     var ok = true;
            });
            result = rmissions
            return resolve(result);
        }).catch(function (error) {
            console.log("Error getting documents: ", error);
            return reject([]);
        });
    });
}

async function getCaptures(db) {
    var queryCaptures = db.collection("capture");
    queryCaptures = queryCaptures.orderBy("createdAt", "desc");
    var result = []

    //Se regresa una promesa para que todo funcione bien
    return new Promise((resolve, reject) => {

        queryCaptures.get().then(function (snapshot) {
            var rcaptures = [];
            var docs = snapshot

            docs.forEach(function (doc) {

                var data = doc.data();
                rcaptures.push(data);
                //     data._id = doc.id;
                //     data.contentType = "mission";
                //     data.distanceToUser = doc.distanceToUser;
                //     var lan = "es";
                //     var ok = true;
            });
            result = rcaptures
            return resolve(result);
        }).catch(function (error) {
            console.log("Error getting documents: ", error);
            return reject([]);
        });
    });
}

async function getUsers(db) {
    var queryUsers = db.collection("users");
    var result = []

    //Se regresa una promesa para que todo funcione bien
    return new Promise((resolve, reject) => {

        queryUsers.get().then(function (snapshot) {
            var rusers = [];
            var docs = snapshot

            docs.forEach(function (doc) {

                var data = doc.data();
                rusers.push(data);
                //     data._id = doc.id;
                //     data.contentType = "mission";
                //     data.distanceToUser = doc.distanceToUser;
                //     var lan = "es";
                //     var ok = true;
            });
            result = rusers
            return resolve(result);
        }).catch(function (error) {
            console.log("Error getting documents: ", error);
            return reject([]);
        });
    });
}

exports.dashboardAnalytics = functions.https.onRequest(async (request, response) => {
    //TODO: checar si aun se usa el CORS
    utils.cors(request, response, async () => {

        // //Checar los valores necesarios
        // if (request.body.UID == null || request.body.startIndex == null || request.body.numberOfFeeds == null) {
        //     response.status(400).json({ status: "bad", reason: "bad format" });
        //     return;
        // }

        // if (request.body.sortBy == null || !stringContainsAnyOf(request.body.sortBy, ["date", "location"])) {
        //     request.body.sortBy = "date";
        // }

        // if (request.body.filter == null) {
        //     request.body.filter = { contentType: { missions: true } };
        // }

        // if (request.body.filter.contentType == null) {
        //     request.body.filter.contentType = { missions: true };
        // }

        console.log("Querying data to DB");
        const db = admin.firestore();

        var result = {};
        result.missions =  await getMissions(db);
        result.captures = await getCaptures(db);
        result.users = await getUsers(db);
        //result.lastCaptures = await getLastCaptures(db);

        // if (request.body.filter.contentType.missions != null && request.body.filter.contentType.missions == true) {
        //     console.log("Querying missions");
        //     request.body.filter.dashboard = true;
        //     result = await getContentByMissions(request.body.startIndex + request.body.numberOfFeeds, request.body.sortBy, request.body.filter, db);
        // }
        // if (request.body.filter.contentType.captures != null && request.body.filter.contentType.captures == true) {
        //     console.log("Querying captures");
        //     result = await getContentByCapture(request.body.startIndex + request.body.numberOfFeeds, request.body.sortBy, request.body.filter, db);
        // }
        // if (request.body.filter.contentType.users != null && request.body.filter.contentType.users == true) {
        //     console.log("Querying users");
        //     result = await getContentByUsers(request.body.startIndex + request.body.numberOfFeeds, request.body.sortBy, request.body.filter, db);
        // }


        // if (request.body.filter.contentType.hashtags != null && request.body.filter.contentType.hashtags == true) {
        //     console.log("Querying hashtags");
        //     result = await getContentByHashtags(request.body.startIndex + request.body.numberOfFeeds, request.body.sortBy, request.body.filter, db);
        // }

        console.log("Responding");
        response.status(200).json({ status: "ok", result: result });

    });
});

//exports.saveDailyAnalytics = functions.pubsub.schedule('every day 06:00').timeZone('America/Mexico_City').onRun(index.saveAnalytics);
exports.saveDailyAnalytics = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    //console.log('This will be run every 1 minutes!');

    console.log("Querying analytics data to DB");
    const db = admin.firestore();

    var result = {};
    result.missions = await getMissions(db);
    result.captures = await getCaptures(db);
    result.users = await getUsers(db);

    result.opentaskMissions = []

    result.missions.forEach(mission => {
        if (mission.opentask !== "") {
            result.opentaskMissions.push(mission)
        }
    });

    //cuantos usuarios han cumplido misiones
    result.usersCompletedMissions = new Map()
    result.captures.forEach(capture => {
        result.usersCompletedMissions.set(capture.userId, null)
        // if (capture.opentask !== "") {
        //     usersCompletedMissions.push(capture)
        // }
    });

    //cuantos usuarios han creado misiones opentask
    result.usersCreatedOpenTask = new Map()
    result.missions.forEach(mission => {
        if (mission.opentask !== null && mission.opentask !== "") {
            result.usersCreatedOpenTask.set(mission.opentask, null)
        }
        // if (capture.opentask !== "") {
        //     usersCompletedMissions.push(capture)
        // }
    });

    var analytics = db.collection('analytics')
    var d = new Date();
    var dt = d.getTime();
    var captureId = null

    var analyticsCapture = {
        totalUsers: result.users.length,
        totalMissions: result.missions.length,
        totalCaptures: result.captures.length,
        OpentaskMissions: result.opentaskMissions,
        usersCompletedMissions: result.usersCompletedMissions,
        usersCreatedOpenTask: result.usersCreatedOpenTask
    }

    await analytics.doc(dt).set(analyticsCapture).then(ref => {
        captureId = ref.id
    });

    console.log("Capture of analytics successful, ID: " + captureId);
    
    return null;
});

// exports.saveAnalytics = functions.https.onRequest(async (request, response) => {
//     //TODO: checar si aun se usa el CORS
//     utils.cors(request, response, async () => {
//         console.log('This will be run every 5 minutes!');

//         // console.log("Querying analytics data to DB");
//         // const db = admin.firestore();

//         // var result = {};
//         // result.missions = await getMissions(db);
//         // result.captures = await getCaptures(db);
//         // result.users = await getUsers(db);

//         // var analytics = db.collection('analytics')
//         // var dt = System.currentTimeMillis();
//         // var captureId = null
//         // await analytics.doc(dt).set({ totalMissions: result.missions.length }).then(ref => {
//         //     captureId = ref.id
//         // });

//         // console.log("Captura de analiticas exitosa: " + captureId);
//         response.status(200).json({ status: "ok", result: result });
//     });
// });