var express = require('express');
var app = express();

app.use(express.static('public'));

app.listen(8000, '127.0.0.1');
