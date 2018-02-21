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
module.exports.naslovnaStran = function (req, res) {
    if(!req.session.trenutniUporabnik) {
        res.render('pages/prijava', {
            uporabnik: ""
        });
    } else {
        let opomnik = [];
        let session = req.session;
        let obj = {monthly: []};
        let idx = [];
        async.parallel({
            uporabniki: function (cb) { Uporabnik.find().exec(cb); },
            cilji: function (cb) { Cilji.find().exec(cb); },
            docs: function (cb) {
                Naloge.find().then(naloga => {
                    let j=0,o=0;
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
                    for (i = 0; i < naloga.length; i++) {
                        let zac = moment(naloga[i].zacetek).format('MM/DD/YYYY');
                        let kon = moment(naloga[i].konec).format('MM/DD/YYYY');
                        let now = moment(Date.now()).format('MM/DD/YYYY');
                        if (naloga[i].vezani_uporabniki.indexOf(session.trenutniUporabnik.id) > -1) {
                            j = i;
                            obj.monthly.push({
                                id: naloga[i].id,
                                name: naloga[i].ime,
                                startdate: moment(naloga[i].zacetek).format('YYYY-MM-DD'),
                                enddate: moment(naloga[i].konec).format('YYYY-MM-DD'),
                                starttime: "15:00",
                                endtime: "18:00",
                                color: color[naloga[i].kategorija],
                                url: "/koledar/" + naloga[i].id
                            });
                        }
                        if (zac == now || dateCheck(zac, kon, now)) {
                            idx.push(i);
                            Uporabnik.findOne({_id: naloga[i].avtor}).then(avtor => {
                                opomnik.push({
                                    ime: naloga[idx[0]].ime,
                                    xp: naloga[idx[0]].xp,
                                    avtor: avtor.ime,
                                    status: naloga[idx[0]].status
                                });
                                idx.shift();
                                console.log(opomnik);
                                if (idx.length == 0) {
                                    console.log("cb");
                                    cb();
                                }
                            }).catch(err => {
                                vrniNapako(res, err);
                                return;
                            });
                        }
                    }
                }).catch(err => {
                    vrniNapako(res, err);
                    return;
                });
            },
            kategorija: function (cb) { Kategorija.find().exec(cb); },
            sCilji: function (cb) { Cilji.find({skupni_cilj: true}).exec(cb); },
        }, function (err, result) {
            if (err) {
                vrniNapako(err,res);
            }
            posodobiJson(obj, session);
            console.log("aync");
            console.log(opomnik);
            res.render("pages/index", {uporabniki : result.uporabniki, uporabnik : req.session.trenutniUporabnik.ime, cilji : result.cilji, tab : currentTab, kategorija : result.kategorija, id : req.session.trenutniUporabnik.id, opomniki: opomnik, skupniCilji: result.sCilji});
            currentTab = 0;
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
               res.redirect("/");
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

//** POST /koledar/:koledarId
module.exports.prikaziKoledar = function(req, res, next) {
    currentTab = 1;
    Naloge.find({_id: req.params.koledarId}, {
    }, function(err, docs){
        if (err) throw err;
        all_items = docs;
        console.log(all_items);
        Kategorija.find({_id: all_items[0].kategorija}).then(kategorija => {
            console.log(kategorija);
            res.render("pages/nalogakoledar", {naloge: all_items, moment : moment, kategorija : kategorija[0].ime});
        }).catch(err => {
            vrniNapako(res, err);
        });
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
    if (req.body.koledar) {
        if (req.body.koledar == "Da") {
            where_search.zacetek = {$ne:null};
        } else {
            where_search.zacetek = null;
        }
    }
    console.log(where_search);
    async.parallel({
            docs: function (cb) { Naloge.find(where_search).exec(cb);},
            kategorija: function (cb) { Kategorija.find().exec(cb); },
            uporabnik: function (cb) { Uporabnik.find().select("slika ime").exec(cb); },
        },
        function(err, results) {
            if (err) {
                vrniNapako(err,res);
            }
            let kat = {},usr = {};
            for(let i=0;i<results.kategorija.length;i++) {
                kat[results.kategorija[i].id] = results.kategorija[i].ime;
            }
            for(let i=0;i<results.uporabnik.length;i++) {
                usr[results.uporabnik[i].id] = [results.uporabnik[i].slika, results.uporabnik[i].id, results.uporabnik[i].ime];
            }
            console.log(usr);
            res.render("pages/nalogequery", {naloge: results.docs, moment : moment, kategorija: kat, slika: usr});
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

function dateCheck(from,to,check) {
    let fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);
    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
}