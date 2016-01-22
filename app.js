var express = require('express');
var app = express();
var scraper = require('./scripts/scraper')
var csvConverter = require('./scripts/csvConverter')
var users = require('./scripts/users')
var players = require('./scripts/players')
var playerid = require('./scripts/playerid')
var points = require('./scripts/points')
var utils = require('./scripts/mongooseutil');
mongoose = require('mongoose');
mongoose.connect(utils.url);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

primed = [];

app.use(express.static('public'));
app.get('/', function (req, res){
   res.sendFile(__dirname + '/views/graphs.html'); 
});

app.get('/transactions', scraper);
app.get('/transactions.csv', csvConverter);
app.get('/users', users);
app.get('/players/:pos', players);
app.get('/players', players);
app.get('/playerid', playerid);
//app.get('/playerid/:fullname', playerid);
app.get('/points/:id/:week', points);
app.get('/points/:id', points);



var server = app.listen(3000);
