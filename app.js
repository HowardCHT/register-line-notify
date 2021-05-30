var express = require('express');
var app = express();
var port = 3000

app.use('/public', express.static('public'));


app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})

var server = app.listen(port, function () {
    console.log(`Example app listening at http://localhost:${port}`)
})