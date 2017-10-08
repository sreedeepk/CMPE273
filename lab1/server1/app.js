'use strict';

const Joi = require('joi');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');

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
  res.send({ name: 'Calculator Service', version: 1.0 });
});

app.get(
  '/add',
  expressValidation({
    query: {
      valueA: Joi.number(),
      valueB: Joi.number()
    }
  }),
  (req, res) => {    
    const { valueA, valueB } = req.query;
    const result = _.add(valueA, valueB);
    console.log('Add =>', valueA, valueB);
    res.send(200, result);
});

app.get(
  '/subtract',
  expressValidation({
    query: {
      valueA: Joi.number(),
      valueB: Joi.number()
    }
  }),
  (req, res) => {
    const { valueA, valueB } = req.query;
    const result = _.subtract(valueA, valueB);
    console.log('SUbtract =>', valueA, valueB);
    res.send(200, result);
});

app.get(
  '/multiply',
  expressValidation({
    query: {
      valueA: Joi.number(),
      valueB: Joi.number()
    }
  }),
  (req, res) => {
    const { valueA, valueB } = req.query;
    const result = _.multiply(valueA, valueB);
    console.log('Multiply =>', valueA, valueB);
    res.send(200, result);
});

app.get(
  '/divide',
  expressValidation({
    query: {
      valueA: Joi.number(),
      valueB: Joi.number()
    }
  }),
  (req, res) => {
    const { valueA, valueB } = req.query;
    //if (!valueB) res.send(404, 'Cannot divide by Zero!');
    const result = _.divide(valueA, valueB);
    console.log('Divide =>', valueA, valueB);
    res.send(200, result);
});
      
app.listen(3000, function () {
  console.log('Calculator app listening on port 3000!')
});
