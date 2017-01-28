var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'Public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/footfall', function(req, res){
  res.send('The footfall information will be provided shortly');
});

app.get('/lighting', function(req, res){
  res.send('The lignting information will be provided shortly');
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
