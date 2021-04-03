const path = require('path');

const express = require('express');

const serveCompressed = require('../index.js');

const app = express();

app.use(serveCompressed({basePath: __dirname}));
app.use('/files', express.static(path.join(__dirname, 'files')));

module.exports = app;
