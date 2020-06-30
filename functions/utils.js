
//TODO: quitar 'http://localhost:3000' !!!!
//exports.cors = require('cors')({ origin: ['http://localhost:3000', 'https://gchgame.web.app', "https://www.apirequest.io", 'https://gchgamedev2.web.app'] });
exports.cors = require('cors')({ origin: true });

async function getMissionsByIds_NOTWORKING(ids, db) {

	var query = db.collection("missions");
	const refs = ids.map(id => query.doc('${id}'));
	console.log("refs ", refs);

	//Se regresa una promesa para que todo funcione bien
	return new Promise((resolve, reject) => {

		db.getAll(...refs).then(function (snapshot) {
			//query.get().then(function (snapshot) {
			var result = [];
			var finished = false;

			console.log("snap0 data", snapshot[0].data());

			snapshot.forEach(function (doc) {
				// doc.data() is never undefined for query doc snapshots
				console.log("doc", doc.data());
				console.log("id", doc.id);
				var data = doc.data();
				//data._id = doc.id;
				result.push(data);
			});

			return resolve(result);
		}).catch(function (error) {
			console.log("Error getting documents: ", error);
			return reject([]);
		});
	});
}

exports.getDocsByIdsInCollection = async function (ids, collection, db) {

	var query = db.collection(collection);
	var result = Array(ids.length).fill();

	//Se regresa una promesa para que todo funcione bien
	return new Promise((resolve, reject) => {
		query.get().then(function (snapshot) {

			snapshot.forEach(function (doc) {
				// doc.data() is never undefined for query doc snapshots
				var data = doc.data();
				data._id = doc.id;

				for (var i = 0; i < ids.length; i++) {
					if (data._id == ids[i]) {
						result[i] = data;
					}
				}
			});

			return resolve(result);
		}).catch(function (error) {
			console.log("Error getting documents: ", error);
			return reject([]);
		});
	});
}

exports.sortArrayAscending = function (arr) {
	arr.sort((a, b) => (a < b) ? -1 : 1);
}

exports.anyInCollectionContainedInUnsortedCollection = function (colA, colB) {
	exports.sortArrayAscending(colB);
	var pa = 0;
	var pb = 0;
	while (pa < colA.length && pb < colB.length) {
		if (colA[pa] == colB[pb]) {
			return true;
		}
		if (colA[pa] < colB[pb]) {
			pa++;
		} else {
			pb++;
		}
	}
	return false;
}
