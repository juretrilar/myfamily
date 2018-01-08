var express = require('express');
var esController = require('./controllers/esController');

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));

esController(app);

app.listen(3000);
