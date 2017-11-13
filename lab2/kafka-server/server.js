var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";
var globalCounter = 0;

var connection =  new require('./kafka/Connection');
var login = require('./services/login');

var producer = connection.getProducer();
var consumer = connection.getConsumer('login_topic');
var consumer1 = connection.getConsumer('signup_topic');
var consumer2 = connection.getConsumer('getfiles_topic');

var ignore_db = false;
var strategy = "pool";

if(strategy == "pool") {
    ignore_db = false;
    MongoClient.connect(url, {
        maxPoolSize: 10
    }, function(err, db) {
        if (err) throw err;
        var getDb = function() {
            return db;
        }
        initiateListeners(getDb, ignore_db);
    });
} else if (strategy == "custompool") {
    // Custom pool of size 3
    var dbArray = [];
    MongoClient.connect(url, {
        maxPoolSize: 1
    }, function(err, db) {
        if (err) throw err;
        dbArray.push(db);
        MongoClient.connect(url, {
            maxPoolSize: 1
        }, function(err, db) {
            if (err) throw err;
            dbArray.push(db);
            MongoClient.connect(url, {
                maxPoolSize: 1
            }, function(err, db) {
                if (err) throw err;
                dbArray.push(db);
                ignore_db = false;
                var getDb = function() {
                    return dbArray[globalCounter % 3];
                }
                initiateListeners(getDb, ignore_db);
            });
        });
    });
} else {
    ignore_db = true;
    var getDb = function() {
        return null;
    }
    initiateListeners(getDb, ignore_db);
}

var initiateListeners = function(getDb, ignore_db) {
    console.log('server is running');
    consumer.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in login');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        login.handle_request(data.data, getDb(), ignore_db, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
    });
    
    consumer1.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in signup');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        login.handle_signup(data.data, getDb(), ignore_db, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
    });
    
    consumer2.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in getfiles');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        login.handle_getfiles(data.data, getDb(), ignore_db, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
    });
}