var bodyParser = require('body-parser');
var ejs = require('ejs');
var mongoose = require('mongoose');

/*mongoose.connect('mongodb://')
var schema = new mongoose.Schema({
    name: String,
    description: String
})

var Cilji = mongoose.model('Cilji', schema);
var itemOne = Cilji({name: 'test'},{description: 'test'}).save(function(err){
    if(err) throw err;
    consol.log('item saved');
});
*/

var urlencodedParser = bodyParser.urlencoded({ extended: false });

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