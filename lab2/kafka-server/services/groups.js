var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";

function create(msg, db, ignore_db, callback) {
	var res = {};
    console.log(msg.username);
    if(ignore_db) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            db.collection("groups").insertOne(msg, function (err, mongores) {
                if (err) throw err;
                else {
                    if(mongores)
                    console.log("1 group created" + mongores);
                }
                db.close();
                callback(null, mongores);
            });
        });
    } else {
        db.collection("groups").insertOne(msg, function (err, mongores) {
            if (err) throw err;
            else {
                if(mongores)
                console.log("1 group created" + mongores);
            }
            callback(null, mongores);
        });
    }
}

function addMembers(msg, db, ignore_db, callback) {
	var res = {};
    console.log(msg.username);
    if(ignore_db) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            db.collection("group_members").insertOne(msg, function (err, mongores) {
                if (err) throw err;
                else {
                    if(mongores)
                    console.log("1 group created" + mongores);
                }
                db.close();
                callback(null, mongores);
            });
        });
    } else {
        db.collection("group_members").insertOne(msg, function (err, mongores) {
            if (err) throw err;
            else {
                if(mongores)
                console.log("1 group created" + mongores);
            }
            callback(null, mongores);
        });
    }
}

function showMembers(msg, db, ignore_db, callback) {
    var req = msg.req
	const username = req.username;
	const group_id = parseInt(req.params.id);

	var res = {};
    console.log(msg.username);
    if(ignore_db) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            db.collection("group_members").findOne(msg, function (err, mongores) {
                if (err) throw err;
                else {
                    if(mongores)
                    console.log(mongores);
                }
                db.close();
                callback(null, mongores);
            });
        });
    } else {
        db.collection("group_members").findOne(msg, function (err, mongores) {
            if (err) throw err;
            else {
                if(mongores)
                console.log(mongores);
            }
            callback(null, mongores);
        });
    }
}

function deleteMembers(req, res) {
    var req = msg.req;
	const username = req.username;
	const group_id = parseInt(req.params.id);

	var res = {};
    console.log(msg.username);
    if(ignore_db) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            db.collection("group_members").remove({username: username, group_id: group_id}, function (err, mongores) {
                if (err) throw err;
                else {
                    if(mongores)
                    console.log( mongores);
                }
                db.close();
                callback(null, mongores);
            });
        });
    } else {
        db.collection("group_members").remove({username: username, group_id: group_id}, function (err, mongores) {
            if (err) throw err;
            else {
                if(mongores)
                console.log( mongores);
            }
            callback(null, mongores);
        });
    }
}

function deleteGroup(req, res) {
	var req = msg.req;
	const username = req.username;
	const group_id = parseInt(req.params.id);

	var res = {};
    console.log(msg.username);
    if(ignore_db) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            db.collection("groups").remove({username: username, group_id: group_id}, function (err, mongores) {
                if (err) throw err;
                else {
                    if(mongores)
                    console.log( mongores);
                }
                db.close();
                callback(null, mongores);
            });
        });
    } else {
        db.collection("groups").remove({username: username, group_id: group_id}, function (err, mongores) {
            if (err) throw err;
            else {
                if(mongores)
                console.log( mongores);
            }
            callback(null, mongores);
        });
    }
}

exports.create = create;
exports.addMembers = addMembers;
exports.showMembers = showMembers;
exports.deleteMembers = deleteMembers;
exports.deleteGroup = deleteGroup;