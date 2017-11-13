var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";

function handle_request(msg, db, ignore_db, callback){

    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));
    if(ignore_db) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            db.collection('login').findOne({"username":msg.username}, function(err, mongores) {
                if (err) throw err;
                console.log("1 document found"  + mongores);
                db.close();
                callback(null, mongores);
            });
        });
    } else {
        db.collection('login').findOne({"username":msg.username}, function(err, mongores) {
            if (err) throw err;
            console.log("1 document found"  + mongores);
            callback(null, mongores);
        });
    }
    //callback(null, res);
}

function handle_signup(msg, db, ignore_db, callback){
    var res = {};
    console.log("in handle_signup");
    console.log(msg.data);
    if(ignore_db) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            db.collection("login").insertOne(msg.data, function(err, mongores) {
                if (err) throw err;
                console.log("1 document inserted"  + mongores);
                db.close();
                callback(null, mongores);
            });
        });
    } else {
        db.collection("login").insertOne(msg.data, function(err, mongores) {
            if (err) throw err;
            console.log("1 document inserted"  + mongores);
            callback(null, mongores);
        });
    }
    // return res.status(200).json({data:myobj});


}

exports.handle_request = handle_request;
exports.handle_signup = handle_signup;