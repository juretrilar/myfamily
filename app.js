let express = require('express');
let esController = require('./controllers/esController');

let app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));

esController(app);

app.listen(3000, '212.101.138.62');
