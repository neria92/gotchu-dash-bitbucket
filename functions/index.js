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
async function getTotalMissions(db) {
    var queryMissions = db.collection("missions");
    var result = 0

    //if (sortBy == "date") {
        //query = query.orderBy("startDate", "desc");
    //}

    //Se regresa una promesa para que todo funcione bien
    return new Promise((resolve, reject) => {
        
        
        queryMissions.get().then(function (snapshot) {
            var totalMissions = 0;
            var totalCaptures = 0
            var rmissions = [];
            var docs = snapshot

            docs.forEach(function (doc) {
                totalMissions++
                
                var data = doc.data();
                rmissions.push(data);
                //     data._id = doc.id;
                //     data.contentType = "mission";
                //     data.distanceToUser = doc.distanceToUser;
                //     var lan = "es";
                //     var ok = true;
            });
            result = totalMissions
            return resolve(result);
        }).catch(function (error) {
            console.log("Error getting documents: ", error);
            return reject([]);
        });
    });
}

async function getLastCaptures(db) {
    var queryMissions = db.collection("capture");
    queryMissions = queryMissions.orderBy("createdAt", "asc");
    var lengthLimit = 10
    var result = []

    //if (sortBy == "date") {
        //query = query.orderBy("startDate", "desc");
    //}

    //Se regresa una promesa para que todo funcione bien
    return new Promise((resolve, reject) => {
        queryMissions.get().then(function (snapshot) {
            var finished = false
            var totalCaptures = 0;
            var totalCaptures = 0
            var rcaptures = [];
            var docs = snapshot

            docs.forEach(function (doc) {
                if (finished) {
                    return;
                }
                totalCaptures++
                
                var data = doc.data();
                rcaptures.push(data);
                //     data._id = doc.id;
                //     data.contentType = "mission";
                //     data.distanceToUser = doc.distanceToUser;
                //     var lan = "es";
                //     var ok = true;

                lengthLimit--;
                if (lengthLimit <= 0) {
                    finished = true;
                }
            });
            result = rcaptures
            return resolve(result);
        }).catch(function (error) {
            console.log("Error getting documents: ", error);
            return reject([]);
        });
    });
}

async function getTotalCaptures(db) {
    var queryMissions = db.collection("capture");
    var result = 0

    //if (sortBy == "date") {
    //query = query.orderBy("startDate", "desc");
    //}

    //Se regresa una promesa para que todo funcione bien
    return new Promise((resolve, reject) => {


        queryMissions.get().then(function (snapshot) {
            var totalCaptures = 0;
            var totalCaptures = 0
            var rcaptures = [];
            var docs = snapshot

            docs.forEach(function (doc) {
                totalCaptures++

                var data = doc.data();
                rcaptures.push(data);
                //     data._id = doc.id;
                //     data.contentType = "mission";
                //     data.distanceToUser = doc.distanceToUser;
                //     var lan = "es";
                //     var ok = true;
            });
            result = totalCaptures
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
        result.totalMissions =  await getTotalMissions(db);
        result.totalCaptures = await getTotalCaptures(db);
        result.lastCaptures = await getLastCaptures(db);

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