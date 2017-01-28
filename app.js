var express = require('express'),
    app = express(),
    path = require('path'),
    sql = require('mysql');

var sqlConnection = sql.createConnection({
    host: "myeusql.dur.ac.uk",
    user: "hnvp67",
    password: "mornin2g",
    insecureAuth: true,
    database: "Phnvp67_safety_app"
});

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
    sqlConnection.query("SELECT * FROM street_lights", function (err, dbres) {
        res.send(dbres);
    })
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

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
