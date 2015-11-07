var express = require('express');
var app = express();

app.use('/api/games/', require('./routes/games'));

app.listen(8080, '127.0.0.1');
