let mongoose = require('mongoose');

let Uporabnik = mongoose.model("Uporabnik");
let Cilji = mongoose.model("Cilji");
let Naloge = mongoose.model("Naloge");
let Druzina = mongoose.model("Druzina");

let ObjectId = mongoose.Types.ObjectId;
let bodyParser = require('body-parser');
let ejs = require('ejs');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

function vrniNapako(res, err){
    res.render("pages/error", {message : "Napaka pri poizvedbi /db", error : {status : 500, stack : err}});
}

//** GET /
module.exports.naslovnaStran = function (req, res, next) {

    if(!req.session.trenutniUporabnik) {
        res.render('pages/prijava', {
            isLoggedIn: false
        });
    } else {
        Uporabnik.find().then(uporabniki => {
            console.log(uporabniki);
            res.render("pages/index", {data : uporabniki, uporabnik : req.session.trenutniUporabnik.ime, isLoggedIn : true});
        }).catch(err => {
            vrniNapako(res, err);
        });
    }
};

//** POST /priava
module.exports.prijaviUporabnika = function(req, res, next){
    let session = req.session;
    let email = req.body.email;
    let geslo = req.body.password;
    Uporabnik.find(function(err, data){
        if(err) {
            console.log(err);
            res.render('pages/prijava', {
                isLoggedIn: false,
                lengthFamily: 0,
                uporabnik: ""
            });
        }
        else {
            req.session.trenutniUporabnik = null;
            for(i in data){
                //ce se email in geslo ujemata
                if(data[i].email === email && data[i].geslo === geslo){
                    console.log("here we are");
                    //shrani podatke v sejo
                    session.trenutniUporabnik = {
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
                    Uporabnik.findByIdAndUpdate(req.session.trenutniUporabnik.id, {zadnjaPrijava : new Date()}).catch(err => {
                        vrniNapako(res, err);
                    });
                    break;
                }
            }
            if(session.trenutniUporabnik){
                Uporabnik.find().then(uporabniki => {
                    console.log(uporabniki);
                    res.render("pages/index", {data : uporabniki, uporabnik : req.session.trenutniUporabnik.ime, isLoggedIn : true});
                }).catch(err => {
                    vrniNapako(res, err);
                });
            } else {
                res.render("pages/prijava", {sporociloPrijava : "Napačen e-mail in/ali geslo!", isLoggedIn: false});
            }
        }
    });
};

//** POST /registracija
module.exports.ustvariUporabnika = function(req, res, next) {
    console.log(req.body);
    let family = ustvariKljuc();
    if(req.body.family) family=req.body.family;
    let noviUporabnik = {
        _id : new ObjectId(),
        ime: req.body.name_surname,
        druzina:  new ObjectId(),
        geslo: req.body.password,
        email: req.body.email,
        telefon: req.body.phone,
        admin: true,
        slika: "staticna_pot_na_slike",
        created_at: Date.now(),
        updated_at: Date.now()
    };
    Uporabnik.create(noviUporabnik).then(data => {
        console.log("CREATED USER");
        res.render('pages/prijava',{
            isLoggedIn: false
        });
    }).catch(err => {
        vrniNapako(res, err);
    });
};

//** POST /ustvari_nalogo
module.exports.ustvariNalogo = function(req, res, next) {
    let novaNaloga = {
        _id : new ObjectId(),
        ime: req.body.imeDialog,
        opis: req.body.opisDialog,
        kategorija: req.body.kategorija,
        zacetek: req.body.targetZacetek,
        konec: req.body.targetKonec,
        xp: 100,
        vezan_cilj: poisciCilj(),
        vezani_uporabniki: "",
        avtor: req.session.id,
        opravljen: res.body.opravljen
    };
    if(req.body.targetZacetek) {
        novaNaloga.zacetek = req.body.targetZacetek;
    }
};

/*
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

}; */

function ustvariKljuc() {
    return 121;
}

function poisciCilj() {
    return new ObjectId();
}