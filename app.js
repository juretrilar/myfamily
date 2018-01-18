let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require("mongoose");
let esController = require('./controllers/esController');

require("./models/db");

let app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(bodyParser.json());

esController(app);

app.listen(3000);
