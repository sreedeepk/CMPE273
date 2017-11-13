var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";

function handle_getfiles(msg, db, ignore_db, callback) {
    var res = {};
    console.log("in handle_signup");
    console.log(msg.username);
    if(ignore_db) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            db.collection("login").findOne({"username": msg.username}, function (err, mongores) {
                if (err) throw err;
                else {
                    if(mongores)
                    console.log("1 document found" + mongores);
                }
                db.close();
                callback(null, mongores);
            });
        });
    } else {
        db.collection("login").findOne({"username": msg.username}, function (err, mongores) {
            if (err) throw err;
            else {
                if(mongores)
                console.log("1 document found" + mongores);
            }
            callback(null, mongores);
        });
    }
}

function upload(msg, db, ignore_db, callback) {
    req = msg.req
	if(req.files[0]) {
        console.log(msg.username);
        if(ignore_db) {
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                db.collection("files").insertOne(msg.data, function(err, mongores) {
                    if (err) throw err;
                    console.log("File inserted"  + mongores);
                    db.close();
                    callback(null, mongores);
                });
            });
        } else {
            db.collection("files").insertOne(msg.data, function(err, mongores) {
                if (err) throw err;
                console.log("File inserted"  + mongores);
                db.close();
                callback(null, mongores);
            });
        }
	}
}

function getFile(msg, db, ignore_db, callback) {
    req = msg.req;
    id = msg.id;
	var res = {};
    console.log(msg);
    if(ignore_db) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            db.collection("files").findOne({"username": msg.username, "file": id}, function (err, mongores) {
                if (err) throw err;
                else {
                    if(mongores)
                    console.log("1 document found" + mongores);
                }
                db.close();
                callback(null, mongores);
            });
        });
    } else {
        db.collection("files").findOne({"username": msg.username, "file": id}, function (err, mongores) {
            if (err) throw err;
            else {
                if(mongores)
                console.log("1 document found" + mongores);
            }
            callback(null, mongores);
        });
    }
}

exports.upload = upload;
exports.getFile = getFile;
exports.handle_getfiles = handle_getfiles;