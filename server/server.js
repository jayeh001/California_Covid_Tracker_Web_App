const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')

const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// Route 1 - register as GET 
app.get('/hello', routes.hello)

// Route 2 - register as GET 
app.get('/covid/:type', routes.covid)

// Route 3 - register as GET 
app.get('/correlations/:category/:type', routes.correlations)

// Route 4 - register as GET 
app.get('/timeline/:type', routes.timeline)

// Route 4.5 - register as GET
app.get('/timelineCorr', routes.timelineCorr)

// Route 5 - register as GET
app.get('/counties', routes.counties)


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
