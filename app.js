var express = require('express')
var app = express()

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.get('/footfall', function(req, res){
  res.send('The footfall information will be provided shortly')
})

app.get('/lighting', function(req, res){
  res.send('The lignting information will be provided shortly')
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
