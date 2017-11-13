var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";

function info(msg, db, ignore_db, callback) {
    const username = msg.req.username;
    
    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));
    if(ignore_db) {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            db.collection('users').findOne({"username":username}, function(err, mongores) {
                if (err) throw err;
                console.log("1 document found"  + mongores);
                callback(null, mongores);
            });
        });
    } else {
        db.collection('users').findOne({"username":username}, function(err, mongores) {
            if (err) throw err;
            console.log("1 document found"  + mongores);
            callback(null, mongores);
        });
    }
}

exports.info = info;