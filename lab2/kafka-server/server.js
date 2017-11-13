var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";
var globalCounter = 0;

var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var users = require('./services/users');
var files = require('./services/files');
var groups = require('./services/groups');

var producer = connection.getProducer();
var login_consumer = connection.getConsumer('login_topic');
var signup_consumer = connection.getConsumer('signup_topic');
var getfiles_consumer = connection.getConsumer('getfiles_topic');
var getusersinfo_consumer = connection.getConsumer('getusersinfo_topic');
var uploadfile_consumer = connection.getConsumer('uploadfile_topic');
var getfile_consumer = connection.getConsumer('getfile_topic');
var creategroups_consumer = connection.getConsumer('creategroups_topic');
var addmembers_consumer = connection.getConsumer('addmembers_topic');
var showmembers_consumer = connection.getConsumer('showmembers_topic');
var deletemembers_consumer = connection.getConsumer('deletemembers_topic');
var deletegroups_consumer = connection.getConsumer('deletegroups_topic');

var ignore_db = false;
var strategy = "pool";

var initiateListeners = function(getDb, ignore_db) {
    console.log('server is running');
    login_consumer.on('message', function (message) {
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
    
    signup_consumer.on('message', function (message) {
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

    getusersinfo_consumer.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in users');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        users.info(data.data, getDb(), ignore_db, function(err,res){
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
    
    getfiles_consumer.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in getfiles');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        files.handle_getfiles(data.data, getDb(), ignore_db, function(err,res){
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

    uploadfile_consumer.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in uploadfile_consumer');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        files.upload(data.data, getDb(), ignore_db, function(err,res){
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
    
    getfile_consumer.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in getfile_consumer');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        files.getFile(data.data, getDb(), ignore_db, function(err,res){
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
    
    creategroups_consumer.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in creategroups_consumer');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        groups.create(data.data, getDb(), ignore_db, function(err,res){
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
    
    addmembers_consumer.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in addmembers_consumer');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        groups.addMembers(data.data, getDb(), ignore_db, function(err,res){
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
    
    showmembers_consumer.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in showmembers_consumer');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        groups.showMembers(data.data, getDb(), ignore_db, function(err,res){
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
    
    deletemembers_consumer.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in deletemembers_consumer');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        groups.deleteMembers(data.data, getDb(), ignore_db, function(err,res){
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
    
    deletegroups_consumer.on('message', function (message) {
        globalCounter += 1;
        console.log('message received in deletegroups_consumer');
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        groups.deleteGroup(data.data, getDb(), ignore_db, function(err,res){
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

if(strategy == "pool") {
    ignore_db = false;
    MongoClient.connect(url, {
        poolSize: 10
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
        poolSize: 1
    }, function(err, db) {
        if (err) throw err;
        dbArray.push(db);
        MongoClient.connect(url, {
            poolSize: 1
        }, function(err, db) {
            if (err) throw err;
            dbArray.push(db);
            MongoClient.connect(url, {
                poolSize: 1
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