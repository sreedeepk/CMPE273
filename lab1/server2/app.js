'use strict';

const Joi = require('joi');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');

const users = require("./routes/users");

const expressValidation = require('express-validation');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

expressValidation.options({
  allowUnknownBody: true,
  allowUnknownHeaders: false,
  allowUnknownParams: false,
  allowUnknownQuery: false,
  status: 422,
  statusText: 'Unprocessable Entity'
});

app.get('/', function (req, res) {
  res.send({ name: 'Dropbox server', version: 1.0 });
});

app.get(
  '/test',
  expressValidation({
    query: {
      valueA: Joi.number(),
      valueB: Joi.number()
    }
  }),
  (req, res) => {    
    const { valueA, valueB } = req.query;
    const result = _.add(valueA, valueB);
    users.signin(req, res);
    res.send(200, result);
});

app.listen(5000, function () {
  console.log('Dropbox server listening on port 5000!')
});
