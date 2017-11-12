'use strict';

const Joi = require('joi');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cors = require('cors');

const expressValidation = require('express-validation');
const app = express();

app.use(cors());
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
    console.log('Add =>', valueA, valueB, result);
    res.json({res: result});
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
    console.log('Subtract =>', valueA, valueB);
    res.json({res: result});
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
    res.json({res: result});
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
    const result = _.divide(valueA, valueB);
    console.log('Divide =>', valueA, valueB);
    res.json({res: result});
});
      
app.listen(5000, function () {
  console.log('Calculator app listening on port 5000!')
});
