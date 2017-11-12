'use strict';

const Joi = require('joi');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const expressValidation = require('express-validation');
const session = require('client-sessions');
const app = express();
const fs = require("fs");
const cors = require('cors');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var newDestination = 'data/' + req.user.user_id;
    var stat = null;
    try {
        stat = fs.statSync(newDestination);
    } catch (err) {
        fs.mkdirSync(newDestination);
    }
    if (stat && !stat.isDirectory()) {
        throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
    }       
    cb(null, newDestination);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  }
})

const multerupload = multer({ storage: storage })

const users = require("./routes/users");
const files = require("./routes/files");
const groups = require("./routes/groups");
const mysql = require("./routes/mysql");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});


app.use(session({
  cookieName: 'session',
  secret: 'xyzabc',
  duration: 30 * 60 * 1000,
  activeDuration: 30 * 60 * 1000,
}));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    let query = "select * from users where email=" + mysql.escape(req.session.user.email)
  
    console.log(query);
  
    mysql.pool.query(query, function (error, results, fields) {
      if (error) {
        res.send(500, error.message)
      } else{
        if(results[0]) {
          const user = results[0];
          req.user = user;
          delete req.user.password; // delete the password from the session
          req.session.user = user;  //refresh the session value
          res.locals.user = user;
        }
      }
      next();
    });
  } else {
    next();
  }
});

expressValidation.options({
  allowUnknownBody: true,
  allowUnknownHeaders: false,
  allowUnknownParams: false,
  allowUnknownQuery: false,
  status: 422,
  statusText: 'Unprocessable Entity'
});

function requireLogin (req, res, next) {
  if (!req.user) {
    res.send(401, "Unauthorized");
  } else {
    next();
  }
};

app.get('/', function (req, res) {
  res.send({ name: 'Dropbox server', version: 1.0 });
});

app.post(
  '/users/signup',
  expressValidation({
    body: {
      email: Joi.string(),
      password: Joi.string(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      overview: Joi.string(),
      work: Joi.string(),
      interests: Joi.string(),
    }
  }), (req, res) => {
    users.signup(req,res)
  }
);

app.post(
  '/users/signin',
  expressValidation({
    body: {
      email: Joi.string(),
      password: Joi.string()
    }
  }), (req, res) => {
    users.signin(req,res)
  }
);

app.post(
  '/users/signout',
  expressValidation({
    body: {
    }
  }), (req, res) => {
    users.signout(req,res)
  }
);

app.get(
  '/users/info',
  requireLogin,
  expressValidation({
    body: {
    }
  }), (req, res) => {
    users.info(req,res)
  }
);

// Files
app.post(
  '/files/upload',
  requireLogin,
  expressValidation({
    body: {
    }
  }), multerupload.any(),
  (req, res) => {
    files.upload(req,res)
  }
);

app.get(
  '/files',
  requireLogin,
  expressValidation({
    body: {
    }
  }), (req, res) => {
    files.getFilesList(req,res)
  }
);

app.get(
  '/files/:id',
  requireLogin,
  expressValidation({
    body: {
    }
  }), (req, res) => {
    files.getFile(req,res, req.params.id)
  }
);

// Groups
app.post(
  '/groups/create',
  requireLogin,
  expressValidation({
    body: {
      name: Joi.string()
    }
  }), (req, res) => {
    groups.create(req,res)
  }
);

app.post(
  '/groups/:id/members',
  requireLogin,
  expressValidation({
    body: {
      email: Joi.string()
    }
  }), (req, res) => {
    groups.addMembers(req,res)
  }
);

app.get(
  '/groups/:id/members',
  requireLogin,
  expressValidation({
    body: {
    }
  }), (req, res) => {
    groups.showMembers(req,res)
  }
);

app.delete(
  '/groups/:id/members',
  requireLogin,
  expressValidation({
    body: {
      email: Joi.string()
    }
  }), (req, res) => {
    groups.deleteMembers(req,res)
  }
);

app.delete(
  '/groups/:id',
  requireLogin,
  expressValidation({
    body: {
    }
  }), (req, res) => {
    groups.deleteGroup(req,res)
  }
);


app.listen(5000, function () {
  console.log('Dropbox server listening on port 5000!')
});
