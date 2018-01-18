let bodyParser = require('body-parser');
let ejs = require('ejs');
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');


let urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('pages/index', {person: 'Alenka'});
        console.log("works");

    });

    app.post('/', urlencodedParser, function (req, res) {
        res.json('');
    });

    app.get('/:name', function (req, res) {
        res.render('pages/index', {person: req.params.name});
    });

};