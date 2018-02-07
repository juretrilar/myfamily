let mongoose = require('mongoose');

let Uporabnik = mongoose.model("Uporabnik");
let Cilji = mongoose.model("Cilji");
let Naloge = mongoose.model("Naloge");
let Druzina = mongoose.model("Druzina");
let Kategorija = mongoose.model("Kategroija");

let express = require('express');
let async = require('async');
let ObjectId = mongoose.Types.ObjectId;
let bodyParser = require('body-parser');
let ejs = require('ejs');
let moment = require('moment');
let fs = require('fs');
let mkdirp = require('mkdirp');

let color = {"5a78505d19ac7744c8175d18": "#ff9933", "5a785125e7c9722aa0e1e8ac": "#0099ff", "5a785157425a883c30b08b7a": "#33cc33", "5a785178900a3b278c196667": "#ff00ff"};


let urlencodedParser = bodyParser.urlencoded({ extended: false });

let currentTab = 0;

function vrniNapako(res, err){
    res.render("pages/error", {message : "Napaka pri poizvedbi /db", error : {status : 500, stack : err}});
}

//** GET /
module.exports.naslovnaStran = function (req, res, next) {
    if(!req.session.trenutniUporabnik) {
        res.render('pages/prijava', {
            uporabnik: ""
        });
    } else {
        Uporabnik.find().then(uporabniki => {
            Cilji.find().then(cilji => {
                Kategorija.find().then(kategorija => {
                    console.log(currentTab);
                    res.render("pages/index", {uporabniki : uporabniki, uporabnik : req.session.trenutniUporabnik.ime, cilji : cilji, tab : currentTab, kategorija : kategorija, id : req.session.trenutniUporabnik.id});
                    currentTab = 0;
                }).catch(err => {
                    vrniNapako(res, err);
                });
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
                let where_search = {vezani_uporabniki : session.trenutniUporabnik.id};
                Uporabnik.find().then(uporabniki => {
                    Cilji.find().then(cilji => {
                        Naloge.find(where_search).then(docs => {
                            let j=0;
                            let obj = {
                                monthly: []
                            };
                            for (i = 0; i < docs.length; i++) {
                                j = i;
                                obj.monthly.push({
                                    id: docs[i].id,
                                    name: docs[i].ime,
                                    startdate: moment(docs[i].zacetek).format('YYYY-MM-DD'),
                                    enddate: moment(docs[i].konec).format('YYYY-MM-DD'),
                                    starttime: "15:00",
                                    endtime: "18:00",
                                    color: color[docs[i].kategorija],
                                    url: ""
                                });
                            }
                            /*
                            for (i = 0; i < cilji.length; i++) {
                                if (cilji[i].vezani_uporabniki.indexOf(session.trenutniUporabnik.id) > -1) {
                                    j++;
                                    obj.monthly.push({
                                        id: cilji[i].id,
                                        name: cilji[i].name,
                                        startdate: moment(cilji[i].zacetek).format('YYYY-MM-DD'),
                                        enddate: moment(cilji[i].konec).format('YYYY-MM-DD'),
                                        starttime: "",
                                        endtime: "",
                                        color: "#EF44EF",
                                        url: ""
                                    });
                                }
                            }*/
                            posodobiJson(obj, session);
                        }).catch(err => {
                            vrniNapako(res, err);
                        });
                        Kategorija.find().then(kategorija => {
                            console.log(currentTab);
                            res.render("pages/index", {uporabniki : uporabniki, uporabnik : req.session.trenutniUporabnik.ime, cilji : cilji, tab : currentTab, kategorija : kategorija, id : req.session.trenutniUporabnik.id});
                            currentTab = 0;
                        }).catch(err => {
                            vrniNapako(res, err);
                        });
                    }).catch(err => {
                        vrniNapako(res, err);
                    });
                }).catch(err => {
                    vrniNapako(res, err);
                });
            } else {
                res.render("pages/prijava", {sporociloPrijava : "Napačen e-mail in/ali geslo!", uporabnik : ""});
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

//** POST /prikazi_naloge
module.exports.prikaziNaloge = function(req, res, next) {
    currentTab = 2;
    let where_search = {};
    if (req.body.avtor) where_search.avtor =  req.body.avtor;
    if (req.body.kategorija) where_search.kategorija = req.body.kategorija;
    if (req.body.status) where_search.status = (req.body.status == 'true');
    if (req.body.cilj) where_search.cilj = req.body.cilj;
    if (req.body.oseba) where_search.vezani_uporabniki = req.body.oseba;

    //if (req.oseba!="") where_search = {'oseba' : req.oseba};
    console.log(where_search);

    async.parallel([
        function(callback) {
            Naloge.find( where_search, {
            }, function(err, docs){
                if (err) throw err;
                //console.log(docs);
                all_items = docs;
                //console.log(all_items);
                callback();
            });
        },
        function(callback) {
            Naloge.count(where_search, function(err, doc_count){
                if (err) throw err;
                count = doc_count;
                console.log(count);
                callback();
            });
        }
        ], function done(err) {
        if (err) {
            vrniNapako(res, err);
        }
        res.render("pages/nalogequery", {naloge: all_items, moment : moment});
    });
};

//** POST /ustvari_nalogo
module.exports.ustvariNalogo = function(req, res, next) {
    currentTab = 2;
    let novaNaloga = {
        _id : new ObjectId(),
        ime: req.body.imeDialog,
        opis: req.body.opisDialog,
        kategorija: req.body.sampleKategorija,
        zacetek: req.body.targetZacetek,
        konec: req.body.targetKonec,
        xp: 100,
        vezan_cilj: req.body.sampleCilj,
        vezani_uporabniki: req.body.person,
        avtor: ObjectId(req.session.trenutniUporabnik.id),
        status: false
    };
    if(req.body.targetZacetek == "") novaNaloga.zacetek = dateNow();
    Naloge.create(novaNaloga).then(data => {
        res.redirect('/')
    }).catch(err => {
        vrniNapako(res, err);
    });
};

//** POST /ustvari_cilj
module.exports.ustvariCilj = function(req, res, next) {
    currentTab = 3;
    let novCilj = {
        _id : new ObjectId(),
        ime: req.body.imeDialog,
        opis: req.body.opisDialog,
        zacetek: req.body.targetZacetek,
        konec: req.body.targetKonec,
        vezane_naloge: [],//req.body.person,
        vezani_uporabniki: [],
        avtor: ObjectId(req.session.trenutniUporabnik.id),
        status: false
    };
    console.log(novCilj);
    if(req.body.targetZacetek == "") novCilj.zacetek = dateNow();
    Cilji.create(novCilj).then(data => {
        res.redirect('/');
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

function dateNow() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    if(dd<10)dd = '0'+dd;
    if(mm<10)mm = '0'+mm;
    today = yyyy + '-' + mm + '-' + dd ;
    return today;
}

function ustvariKljuc() {
    return 121;
}

function poisciCilj() {
    return new ObjectId();
}

function posodobiJson(obj, session) {
    let json = JSON.stringify(obj);
    mkdirp('public/' + session.trenutniUporabnik.id + '/data', function (err) {
        if (err) throw err;
        fs.writeFile('public/' + session.trenutniUporabnik.id + '/data/events.json', json, 'utf8', function (err) {
            if (err) throw err;
        });
    });
}