let bodyParser = require('body-parser');
let ejs = require('ejs');
let mongoose = require('mongoose');

/*mongoose.connect('mongodb:localhost/myfamily-db')
var Schema = mongoose.Schema;

userSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at)
        this.created_at = currentDate;
    next();
}

*/

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