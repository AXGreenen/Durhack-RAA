var express = require('express'),
    app = express(),
    path = require('path'),
    sql = require('mysql'),
    appDetails = require('./appDetails.js');

var sqlConnection = sql.createConnection(appDetails.dbDetails);

// connect to the DB
sqlConnection.connect(function(err){
    if(err){
        console.error(err);
    }
    else {
        console.log("connection made!");
    }
});

app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'Public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/footfall', function(req, res){
  res.send('The footfall information will be provided shortly');
});

app.get('/lighting', function(req, res){
    res.sendFile(path.join(__dirname, '/Public/Lighting/lighting.html'));
});

app.get('/heatmap', function(req, res){
    res.sendFile(path.join(__dirname, '/Public/heatmap/heatmap.html'));
});

app.get('/lit-roads', function(req, res){
    res.sendFile(path.join(__dirname, '/Public/litRoads/litRoads.html'));
});

app.get('/map', function (req, res) {
    var options = {
        root: __dirname + '/Public/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile("map.html", options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', "map.html");
        }
    });
});

var api = express.Router();

api.get("/lighting", function(req, res) {
    sqlConnection.query("SELECT * FROM double_street_lights WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?", [req.query.b, req.query.t, req.query.l, req.query.r], function (err, dbres) {
        res.send(dbres);
    })
});

app.use('/api', api);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
