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
let validator = require('validator');

let color = {"5a78505d19ac7744c8175d18": "#ff9933", "5a785125e7c9722aa0e1e8ac": "#0099ff", "5a785157425a883c30b08b7a": "#33cc33", "5a785178900a3b278c196667": "#ff00ff"};


let urlencodedParser = bodyParser.urlencoded({ extended: false });

let currentTab = 0;
let successfulPost = 0;

function vrniNapako(res, err){
    res.render("pages/error", {message : "Napaka pri poizvedbi /db", error : {status : 500, stack : err}});
}

//** GET /
module.exports.naslovnaStran = function (req, res) {
    if(!req.session.trenutniUporabnik) {
        console.log("not logged");
        res.render('pages/prijava', {
            uporabnik: ""
        });
    } else {
        let opomnik = [];
        let session = req.session;
        let obj = {monthly: []};
        let idx = [];
        async.parallel({
            uporabniki: function (cb) { Uporabnik.find().exec(cb);console.log("a"); },
            cilji: function (cb) { Cilji.find().exec(cb);console.log("b"); },
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
                        let zac = moment(naloga[i].zacetek).format('MM-DD-YYYY');
                        let kon = moment(naloga[i].konec).format('MM-DD-YYYY');
                        let now = moment(Date.now()).format('MM-DD-YYYY');
                        if (naloga[i].vezani_uporabniki.indexOf(session.trenutniUporabnik.id) > -1) {
                            j = i;
                            let urZac = moment(naloga[i].zacetek).format('HH:mm');
                            let urKon = moment(naloga[i].konec).format('HH:mm');
                            if(!validator.matches(urZac ,/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g)) urZac = "00:00";
                            if(!validator.matches(urKon ,/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g)) urKon = "23:59";
                            obj.monthly.push({
                                id: naloga[i].id,
                                name: naloga[i].ime,
                                startdate: moment(naloga[i].zacetek).format('YYYY-MM-DD'),
                                enddate: moment(naloga[i].konec).format('YYYY-MM-DD'),
                                starttime: urZac,
                                endtime: urKon,
                                color: color[naloga[i].kategorija],
                                url: "/koledar/" + naloga[i].id
                            });
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
                                    //console.log(opomnik);
                                    if (idx.length == 0) {
                                        cb();
                                    }
                                }).catch(err => {
                                    console.log(err);
                                    vrniNapako(res, err);
                                    return;
                                });
                            }
                        }
                    }
                    console.log("koledar built");
                }).catch(err => {
                    console.log(err);
                    vrniNapako(res, err);
                    return;
                });
            },
            kategorija: function (cb) { Kategorija.find().exec(cb);console.log("c"); },
        }, function (err, result) {
            if (err) {
                console.log("0");
                console.log(err);
                vrniNapako(err,res);
            }
            console.log("1");
            let sCilji = [];
            for (let i=0;i<result.cilji.length;i++) {
                if(result.cilji[i].skupni_cilj == true) {
                    sCilji.push({ime: result.cilji[i].ime, opis: result.cilji[i].opis, vezani_uporabniki: result.cilji[i].vezani_uporabniki, xp: result.cilji[i].xp})
                }
                //console.log(result.cilji[i].vezani_uporabniki, "vezan");
            }
            console.log("2");
            //posodobiJson(obj, session);

            res.render("pages/index", {uporabniki : result.uporabniki, uporabnik : req.session.trenutniUporabnik.ime, cilji : result.cilji, tab : currentTab, kategorija : result.kategorija, id : req.session.trenutniUporabnik.id, opomniki: opomnik, skupniCilji: sCilji,  moment : moment, success: successfulPost});
            console.log("3");
            currentTab = 0;
            successfulPost = 0;
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
                error: "Napaka v povezavi z bazo!"
            });
        }
        else {
            req.session.trenutniUporabnik = null;
            for(i in uporabniki){
                //ce se email in geslo ujemata
                if(uporabniki[i].email === email && uporabniki[i].geslo === geslo){
                    //shrani podatke v sejo
                    session.trenutniUporabnik = {
                        email : uporabniki[i].email,
                        ime : uporabniki[i].ime,
                        telefon : uporabniki[i].telefon,
                        viber : uporabniki[i].viber,
                        id : uporabniki[i]._id,
                        druzina : uporabniki[i].druzina,
                        admin : uporabniki[i].admin,
                        slika : uporabniki[i].slika
                    };
                    Uporabnik.findByIdAndUpdate(req.session.trenutniUporabnik.id, {last_login : new Date()}).catch(err => {
                        vrniNapako(res, err);
                    });
                    session.trenutniUporabnik.last_login = new Date();
                    break;
                }
            }
            console.log(session.trenutniUporabnik);

            if(session.trenutniUporabnik){
               res.redirect("/");
                console.log("here we are");
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
        slika: ""+req.body.avatar,
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
    //console.log(where_search);
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
        //console.log(usr);
        res.render("pages/nalogequery", {naloge: results.docs, moment : moment, kategorija: kat, slika: usr});
    });
};

//** POST /ustvari_nalogo
module.exports.ustvariNalogo = function(req, res, next) {
    currentTab = 2;
    if(!validatenaloga(req,res)) return;
    if(!req.body.dateZacetek) req.body.dateZacetek = new Date().toLocaleTimeString('sl-SI', {year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", timeZoneName: "short"});
    if(!req.body.dateKonec) req.body.dateKonec = new Date().toLocaleTimeString('sl-SI', {year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", timeZoneName: "short"});
    if(req.body.dateZacetek > req.body.dateKonec)  {vrniNapako(res, "Datum konca ne sme biti pred datumom začetka. "+req.body.dateZacetek+" "+req.body.dateKone);return;}
    let dZac = req.body.dateZacetek;
    let dKon = req.body.dateKonec;
    if (dZac != "") {
        if (dKon != "" && dZac > dKon) {
            vrniNapako(res, "Za vezan cilj so bili uporabljeni napačni znaki. "+dZac+" "+dKon);
            return;
        }
    }
    let currXp = req.body.xpNaloge;
    if(req.body.newStatus==false && req.body.oldStatus==true) currXp = -currXp;
    if(req.body.newDialog && req.body.newStatus==false) currXp = 0;
    if(!req.body.newDialog && req.body.newStatus==false) currXp = 0;
    if(req.body.newStatus==true && req.body.oldStatus==true) currXp = 0;
    let novaNaloga = {
        ime: req.body.imeDialog,
        opis: req.body.opisDialog,
        kategorija: req.body.sampleKategorija,
        zacetek: dZac,
        konec: dKon,
        vezani_uporabniki: [],
        xp: req.body.xpNaloge,
        vezan_cilj: req.body.sampleCilj,
        avtor: ObjectId(req.session.trenutniUporabnik.id),
        status: req.body.newStatus
    };
    if(mongoose.Types.ObjectId.isValid(req.body.person)) {
        novaNaloga.vezani_uporabniki.push(req.body.person);
    } else {
        for(let i=0;i<req.body.person.length;i++) {
            if(mongoose.Types.ObjectId.isValid(req.body.person[i])) {
                novaNaloga.vezani_uporabniki.push(mongoose.Types.ObjectId(req.body.person[i]));
            }
        }
    }
            //
    if(req.body.dateZacetek == "") novaNaloga.zacetek = dateNow();
    if(req.body.dateKonec == "") novaNaloga.konec = novaNaloga.zacetek;
    let conditions = { ime: req.body.imeDialog};
    Naloge.findOneAndUpdate(conditions, novaNaloga,{upsert: true, runVlidators: true, returnNewDocument: true}, function (err, doc) { // callback
        if (err) {
            vrniNapako(res, err);
            console.log(err);
            return;
        } else {
            Cilji.findOne({_id: req.body.sampleCilj}, function(err, cilj) {
                if(!err) {
                    let obj = cilj.vezani_uporabniki.map(value => String(value.id_user));
                    if(!obj) obj = {};
                    for(let i = 0; i<novaNaloga.vezani_uporabniki.length; i++) {
                        let index = obj.indexOf(String(novaNaloga.vezani_uporabniki[i]));
                        if (index > -1) {
                            cilj.vezani_uporabniki[index].xp_user += currXp;
                        } else {
                            cilj.vezani_uporabniki.push({"id_user" : novaNaloga.vezani_uporabniki[i], "xp_user" : currXp});
                        }
                    }
                    obj = cilj.vezane_naloge.map(value => String(value.id_nal));
                    let nalId = doc._id;
                    if(req.body.newDialog) nalId = req.body.newDialog;
                    if (obj) {
                        let index = obj.indexOf(nalId);
                        if(index > -1) {
                            cilj.vezane_naloge[index].stanje = req.body.newStatus;
                        } else {
                            cilj.vezane_naloge.push({"id_nal" : nalId, "stanje" : req.body.newStatus});
                        }
                    }
                    console.log(cilj);
                    cilj.save(function (err) {
                        if(!err) {
                            res.redirect("/");
                            successfulPost = 1;
                        }
                        else {
                            vrniNapako(res,err);
                            console.log(err);
                            return;
                        }
                    });
                }
            });
        }
    });
};

//** POST /posodobi_nalogo


//** POST /ustvari_cilj
module.exports.ustvariCilj = function(req, res, next) {
    currentTab = 3;
    validateImeOpisId(req,res);
    if(!validator.isInt(req.body.xpNaloge)) {vrniNapako(res, "Dovoljene so samo cele številke.");return false;}
    let updated = dateNow();
    let novCilj = {
        ime: req.body.imeDialog,
        opis: req.body.opisDialog,
        last_updated: updated,
        skupni_cilj: req.body.skupnaNaloga,
        maxXp: req.body.xpNaloge
    };
    if(req.body.newDialog) {
        if(req.body.stanje) {
            novCilj.konec = updated;
        }
    } else {
        novCilj.zacetek = updated;
    }

    let conditions = { ime: req.body.imeDialog };
    Cilji.findOneAndUpdate(conditions, novCilj,{upsert: true, runValidators: true}, function (err, doc) { // callback
        if (err) {
            vrniNapako(res, err);
        } else {
            successfulPost = 1;
            res.redirect('/')
        }
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

function validatenaloga(req,res) {
    if(!validateImeOpisId(req,res)) return false;
    if(!validator.isMongoId(req.body.sampleKategorija)) {vrniNapako(res, "Za kategorijo so bili uporabljeni napačni znaki. "+req.body.sampleKategorija);return false;}
    if(!validator.isInt(req.body.xpNaloge, [{ min: 1, max: 100 }])) {vrniNapako(res, "Izbrana vrednost mora biti med 1 in 100 xp.");return false;}
    if(!validator.isMongoId(req.body.sampleCilj)) {vrniNapako(res, "Za vezan cilj so bili uporabljeni napačni znaki. "+req.body.sampleCilj);return false;}
    return true;
}

function validateImeOpisId(req,res) {
    //console.log(req.body.newDialog);
    if(req.body.newDialog != "") {if(!validator.isMongoId(req.body.newDialog)) {vrniNapako(res, "Id za posodobitev je napačen. "+req.body.newDialog);return false;}}
    if(!validator.matches(req.body.imeDialog ,/^[A-ZČĆŽŠĐ0-9.,\s]+$/i)) {vrniNapako(res, "Za ime so bili uporabljeni napačni znaki. "+req.body.imeDialog);return false;}
    if(!validator.matches(req.body.opisDialog ,/^[A-ZČĆŽŠĐ0-9.,\s]+$/i)) {vrniNapako(res, "Za opis so bili uporabljeni napačni znaki. "+req.body.opisDialog);return false;}
    return true;
}

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