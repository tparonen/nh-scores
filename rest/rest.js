var express = require('express');
var app = express();

console.log('test');

app.use('/api/games/', require('./routes/games'));

app.listen(8080, '127.0.0.1');
