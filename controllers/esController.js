let mongoose = require('mongoose');
let Uporabnik = mongoose.model("Uporabnik");
let Druzina = mongoose.model("Druzina");
let Cilji = mongoose.model("Cilji");
let Naloge = mongoose.model("Naloge");
let ObjectId = mongoose.Types.ObjectId;

let bodyParser = require('body-parser');
let ejs = require('ejs');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

function vrniNapako(res, err){
    res.render("error", {message : "Napaka pri poizvedbi /db", error : {status : 500, stack : err}});
}

///mongoose.connect('mongodb://localhost/myfamily');

//** GET /
module.exports.naslovnaStran = function (req, res, next) {
    if(!req.session.trenutniUporabnik){
        res.redirect("/prijava");
    } else {
        let podatki = {uporabnik : req.session.trenutniUporabnik};
        if(req.session.trenutniUporabnik.vloga == "admin"){

        } else {
            res.render("index", podatki);
        }
    }
};



//** POST /priava
module.exports.prijaviUporabnika = function(req, res, next){
    let email = req.body.email;
    let geslo = req.body.pwd;
    Uporabnik.find(function(err, data){
        if(err) {
            console.log(err);
            res.send("Napaka!");
        }
        else {
            req.session.trenutniUporabnik = null;
            for(i in data){
                //ce se email in geslo ujemata
                if(data[i].email === email && data[i].geslo === geslo){
                    //shrani podatke v sejo
                    req.session.trenutniUporabnik = {
                        email : data[i].email,
                        ime : data[i].ime,
                        telefon : data[i].telefon,
                        id : data[i]._id,
                        druzina : data[i].druzina,
                        admin : data[i].admin,
                        odsotnosti : data[i].odsotnosti,
                        last_login : data[i].last_login,
                        slika : data[i].slika
                    };
                    //posodobi zadnjo prijavo
                    Uporabnik.findByIdAndUpdate(req.session.trenutniUporabnik.id, {zadnjaPrijava : new Date()}).catch(err => {
                        vrniNapako(res, err);
                    });
                    break;
                }
            }
            if(req.session.trenutniUporabnik){
                res.redirect("/");
            } else {
                res.render("prijava", {sporociloPrijava : "Napačen e-mail in/ali geslo!"});
            }
        }
    });
};

//** GET /registracija


//** POST /registracija
module.exports.ustvariUporabnika = function(req, res, next) {
    let noviUporabnik = {
        _id : new ObjectId(),
        ime: "ime priimek",
        druzina:  new ObjectId(),
        uporabnisko_ime: "uporabnisko_ime",
        geslo: "geslo",
        email: "test@test.si",
        telefon: "123456789",
        admin: true,
        slika: "staticna_pot_na_slike",
        created_at: Date.now(),
        updated_at: Date.now()
    };
    Uporabnik.create(noviUporabnik).then(data => {
        res.redirect("/uporabniki");
    }).catch(err => {
        vrniNapako(res, err);
    });
};


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
        dodajUporabnika(req,res);
    });

};