let mongoose = require('mongoose');

let Uporabnik = mongoose.model("Uporabnik");
let Cilji = mongoose.model("Cilji");
let Naloge = mongoose.model("Naloge");
let Druzina = mongoose.model("Druzina");

let ObjectId = mongoose.Types.ObjectId;
let bodyParser = require('body-parser');
let ejs = require('ejs');

let urlencodedParser = bodyParser.urlencoded({ extended: false });
let users;

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
            Cilji.find().then(cilji => {
                users = uporabniki.ime;
                res.render("pages/index", {uporabniki : uporabniki, uporabnik : req.session.trenutniUporabnik.ime, cilji : cilji, isLoggedIn : true});
            }).catch(err => {
                vrniNapako(res, err);
            });
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
    Uporabnik.find(function(err, uporabniki){
        if(err) {
            console.log(err);
            res.render('pages/prijava', {
                isLoggedIn: false,
                uporabniki: 0,
                uporabnik: "",
                error: "Napačen e-poštni naslov ali geslo."
            });
        }
        else {
            req.session.trenutniUporabnik = null;
            for(i in uporabniki){
                //ce se email in geslo ujemata
                if(uporabniki[i].email === email && uporabniki[i].geslo === geslo){
                    console.log("here we are");
                    //shrani podatke v sejo
                    session.trenutniUporabnik = {
                        email : uporabniki[i].email,
                        ime : uporabniki[i].ime,
                        telefon : uporabniki[i].telefon,
                        id : uporabniki[i]._id,
                        druzina : uporabniki[i].druzina,
                        admin : uporabniki[i].admin,
                        odsotnosti : uporabniki[i].odsotnosti,
                        last_login : uporabniki[i].last_login,
                        slika : uporabniki[i].slika
                    };
                    Uporabnik.findByIdAndUpdate(req.session.trenutniUporabnik.id, {zadnjaPrijava : new Date()}).catch(err => {
                        vrniNapako(res, err);
                    });
                    break;
                }
            }
            if(session.trenutniUporabnik){
                Uporabnik.find().then(uporabniki => {
                    Cilji.find().then(cilji => {
                        res.render("pages/index", {uporabniki : uporabniki, uporabnik : req.session.trenutniUporabnik.ime, cilji : cilji, isLoggedIn : true});
                    }).catch(err => {
                        vrniNapako(res, err);
                    });
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
        res.redirect('/');
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
        kategorija: req.body.sampleKategorija,
        zacetek: req.body.targetZacetek,
        konec: req.body.targetKonec,
        xp: 100,
        vezan_cilj: req.body.sampleCilj,
        vezani_uporabniki: [],
        avtor: ObjectId(req.session.trenutniUporabnik.id),
        status: false
    };
    if(req.body.targetZacetek) {
        novaNaloga.zacetek = req.body.targetZacetek;
    }
    let j = 0;
    console.log(req.body.person_0);
    for(i=0;i<users.length;i++) {
        if(req.body.person_+i) {
            vezani_uporabniki[j] = ObjectId(req.body.person_+i.val);
            j++;
        }

    }
    Naloge.create(novaNaloga).then(data => {
        console.log("CREATED Naloga");
        Uporabnik.find().then(uporabniki => {
            Cilji.find().then(cilji => {
                res.render("pages/index", {uporabniki : uporabniki, uporabnik : req.session.trenutniUporabnik.ime, cilji : cilji, isLoggedIn : true});
            }).catch(err => {
                vrniNapako(res, err);
            });
        }).catch(err => {
            vrniNapako(res, err);
        });
    }).catch(err => {
        vrniNapako(res, err);
    });
};

//** GET /odjava

module.exports.odjava = function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
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