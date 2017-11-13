var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";

function handle_request(msg, callback){

    mongo.connect(mongoURL, function(){
        var res = {};
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('login');

        console.log('hi');
        console.log( msg.username);

        coll.findOne({username: msg.username, password:msg.password}, function(err, user){
            console.log( user);
            if (user) {
                res.code = "201";
                res.value = "user already present";

            } else {


                coll.insert({
                        username: msg.username,
                        password: msg.password,
                        firstname: msg.firstname,
                        lastname: msg.lastname,
                        contact: msg.contact
                    }
                    , function (err, user) {
                       console.log( user);
                        if (user) {
                            res.code = "200";
                            res.value = "User inserted";
                        }
                        else {
                            res.code = "401";
                            res.value = "Failed Signup";
                        }

                        console.log(res);
                        callback(null, res);
                    });


            }

        });
    }) ;
}
exports.handle_request = handle_request;