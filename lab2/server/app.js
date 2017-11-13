var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
require('./routes/passport')(passport);

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);
var kafka = require('./routes/kafka/client');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL,
        ttl:60*60
    })
}));
app.use(passport.initialize());

app.use('/', routes);
// app.use('/users', users);

app.post('/users/signout', function(req,res) {
    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(200).send();
});

app.post('/users/signin', function(req, res) {
    passport.authenticate('login', function(err, user) {
        if(err) {
            res.status(500).send();
        }

        if(!user) {
            res.status(401).send();
        }
        else {
            req.session.user = user.results.username;
            console.log(user);
            console.log(req.session.user);
            console.log("session initilized");




            return res.status(201).send({userdata: user.results});
        }
    })(req, res);
});

app.get('/files/:username',function(req,res){
    kafka.make_request('getfiles_topic',{"username":req.params.username}, function(err,results){
        console.log('in result');
        console.log(results);
        if(err) {
            res.status(500).send();
        }
        else{
            res.status(200).send({"results":results});
        }
    });
});


app.post('/users/signup', function(req, res) {
    var  myobj = { "username" :req.body.username ,"password" : req.body.password,"firstname":req.body.firstname,"lastname":req.body.lastname,"data":
        [
            {
                "filename" : "1.jpg"
            },
            {
                "filename" : "2.jpg"
            },
            {
                "filename" : "3.jpg"
            },
            {
                "filename" : "4.jpg"
            }
        ]};
    kafka.make_request('signup_topic',{"data":myobj}, function(err,results){
        console.log('in result');
        console.log(results);
        if(err) {
            res.status(500).send();
        }
        else{
            res.status(200).send({"results":results});
        }
    });
});







module.exports = app;