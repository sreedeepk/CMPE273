var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;


/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback){
    MongoClient.connect(url, {
          poolSize: 10    
        },
       function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
  
};

// var MongoClient = require('mongodb').MongoClient;
// var db;
// var connected;
// var strategy = true;

// if(strategy == true) {
//   // Pool
//   var url = "mongodb://localhost:27017/test";
//   MongoClient.connect(url, {
//     poolSize: 10    
//   }, function(err, _db){
//     if (err) { throw new Error('Could not connect: '+err); }
//     db = _db;
//     connected = true;
//     console.log(connected +" is connected?");
//   });
//   exports.db = db;
// } else {
//   // Single connection
//   var url = "mongodb://localhost:27017/test";
//   MongoClient.connect(url, {
//     poolSize: 1   
//   }, function(err, _db){
//     if (err) { throw new Error('Could not connect: '+err); }
//     db = _db;
//     connected = true;
//     console.log(connected +" is connected?");
//   });
//   exports.db = db;
// }