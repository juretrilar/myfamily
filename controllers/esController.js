let mongoose = require('mongoose');

let Uporabnik = mongoose.model("Uporabnik");
let Cilji = mongoose.model("Cilji");
let Naloge = mongoose.model("Naloge");
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
let SMSAPI = require('smsapicom'), smsapi = new SMSAPI();
let CronJob = require('cron').CronJob;
let nodemailer = require('nodemailer');

let color = {"5a78505d19ac7744c8175d18": "#ff9933", "5a785125e7c9722aa0e1e8ac": "#0099ff", "5a785157425a883c30b08b7a": "#33cc33", "5a785178900a3b278c196667": "#ff00ff"};

let urlencodedParser = bodyParser.urlencoded({ extended: false });

let currentTab = 0;
let successfulPost = 0;
let jobsCounter = 0;
let jobs = {};

/*
smsapi.authentication
    .login(process.env.SMSAPI_user, process.env.SMSAPI_pass)
    .then(sendMessage)
    .then(displayResult)
    .catch(displayError); */

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.mailUser,
        pass: process.env.mailPass
    }
});

function vrniNapako(res, err){
    res.render("pages/error", {message : "Napaka pri poizvedbi /db", error : {status : 500, stack : err}});
}

//** GET /
module.exports.naslovnaStran = function (req, res) {
    if (checkIfLogged(res, req) != 0) return;    
    let opomnik = [];
    let obj = {monthly: []};
    let idx = [];
    console.log(req.session.trenutniUporabnik.druzina);
    async.parallel({
        uporabniki: function (cb) {
            Uporabnik.find({druzina: mongoose.Types.ObjectId(req.session.trenutniUporabnik.druzina)}).exec(cb);
            },
        cilji: function (cb) {
            Cilji.find({$query: {druzina: mongoose.Types.ObjectId(req.session.trenutniUporabnik.druzina)},$maxTimeMS: 10000 }).exec(cb);
                },
        docs: function (cb) {
            Naloge.find({$query: {druzina: mongoose.Types.ObjectId(req.session.trenutniUporabnik.druzina)},$maxTimeMS: 10000 }).then(naloga => {
                if(naloga.length == 0) {
                    cb();
                    return;
                }
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
                for (let i = 0; i < naloga.length; i++) {
                    let zac = moment(naloga[i].zacetek).format('MM-DD-YYYY');
                    let kon = moment(naloga[i].konec).format('MM-DD-YYYY');
                    let now = moment(Date.now()).format('MM-DD-YYYY');
                    if (naloga[i].vezani_uporabniki.indexOf(req.session.trenutniUporabnik.id) > -1) {
                        j = i;
                        let urZac = moment(naloga[i].zacetek).format('HH:mm');
                        let urKon = moment(naloga[i].konec).format('HH:mm');
                        if(!validator.matches(urZac ,/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g)) urZac = "00:00";
                        if(!validator.matches(urKon ,/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g)) urKon = "23:59";
                        obj.monthly.push({ //Dodaj nalogo v koledar
                            id: naloga[i].id,
                            name: naloga[i].ime,
                            startdate: moment(naloga[i].zacetek).format('YYYY-MM-DD'),
                            enddate: moment(naloga[i].konec).format('YYYY-MM-DD'),
                            starttime: urZac,
                            endtime: urKon,
                            color: color[naloga[i].kategorija],
                            url: "/koledar/" + naloga[i].id
                        });
                        if (zac == now || dateCheck(zac, kon, now)) { // Če je naloga na današnji dan jo dodaj v opomnike
                            idx.push(naloga[i]);
                        }
                    }
                }
                if (idx.length == 0) { //Če je dolžina 0, za ta datum ni opomnikov
                    cb();
                }
                let m = idx.length;
                while (m-- > 0) {
                    Uporabnik.findOne({_id: idx[0].avtor}).then(avtor => {
                        opomnik.push({
                            ime: idx[0].ime,
                            xp: idx[0].xp,
                            avtor: avtor.ime,
                            status: idx[0].status
                        });
                        idx.shift();
                        if (idx.length == 0) {
                            cb();
                        }
                    }).catch(err => {
                        console.log(err);
                        vrniNapako(res, err);
                        return;
                    });
                }
            }).catch(err => {
                console.log(err);
                vrniNapako(res, err);
                return;
            });
            //console.log("m");
        },
        kategorija: function (cb) {
            Kategorija.find({$query: {},$maxTimeMS: 10000 }).exec(cb);
            //console.log("k");
        },
    }, function (err, result) {
        console.log("end of result");
        if (err) {
            //console.log(err);
            vrniNapako(err,res);
        }
        //console.log("1");
        let sCilji = [];
        for (let i=0;i<result.cilji.length;i++) {
            if(result.cilji[i].skupni_cilj == true) {
                sCilji.push({ime: result.cilji[i].ime, opis: result.cilji[i].opis, vezani_uporabniki: result.cilji[i].vezani_uporabniki, xp: result.cilji[i].xp})
            }
            //console.log(result.cilji[i].vezani_uporabniki, "vezan");
        }
        //console.log(req.session);
        posodobiJson(obj, req.session);
        res.render("pages/index", {uporabniki : result.uporabniki, currSession : req.session, cilji : result.cilji, tab : currentTab, kategorija : result.kategorija, id : req.session.trenutniUporabnik.id, opomniki: opomnik, skupniCilji: sCilji,  moment : moment, success: successfulPost});
        //console.log("3");
        currentTab = 0;
        successfulPost = 0;
    });
};

module.exports.prijava = function(req, res, next) {
    res.redirect("/");
};

//** POST /priava
module.exports.prijaviUporabnika = function(req, res, next){
    let email = req.body.email;
    let geslo = req.body.password;
    Uporabnik.find(function(err, uporabniki){
        if(err) {
            console.log(err);
            res.render('pages/prijava', {
                isLoggedIn: false,
                uporabniki: 0,
                uporabnik: "",
                sporociloPrijava : "Napačen e-mail in/ali geslo!"
            });
        }
        else {
            req.session.trenutniUporabnik = null;
            for(i in uporabniki){
                //ce se email in geslo ujemata
                if(uporabniki[i].email === email && uporabniki[i].geslo === geslo){
                    //shrani podatke v sejo
                    req.session.trenutniUporabnik = {
                        email : uporabniki[i].email,
                        ime : uporabniki[i].ime,
                        telefon : uporabniki[i].telefon,
                        viber : uporabniki[i].viber,
                        id : uporabniki[i]._id,
                        druzina : uporabniki[i].druzina,
                        admin : uporabniki[i].admin,
                        slika : uporabniki[i].slika,
                        vrsta : uporabniki[i].vrsta,
                        notf_email : uporabniki[i].notf_email,
                        notf_telefon :  uporabniki[i].notf_telefon
                    };
                    Uporabnik.findByIdAndUpdate(req.session.trenutniUporabnik.id, {last_login : new Date()}).catch(err => {
                        vrniNapako(res, err);
                    });
                    req.session.trenutniUporabnik.last_login = new Date();
                    break;
                }
            }
            //console.log(req.session.trenutniUporabnik);
            if(req.session.trenutniUporabnik){
               res.redirect("/");
            } else {
                res.render("pages/prijava", {sporociloPrijava : "Napačen e-mail in/ali geslo!", uporabnik : ""});
            }
        }
    });
};

//** POST /registracija
module.exports.ustvariUporabnika = function(req, res, next) {
    let family = ustvariKljuc();
    if(req.body.family) family=req.body.family;
    let noviUporabnik = {
        _id : new ObjectId(),
        ime: req.body.reg_name,
        druzina:  new ObjectId(),
        geslo: req.body.reg_password,
        email: req.body.reg_email,
        telefon: req.body.reg_phone,
        notf_email: false,
        notf_telefon: false,
        vrsta: 0,
        admin: false,
        slika: ""+req.body.avatar,
        created_at: Date.now()
    };
    Uporabnik.create(noviUporabnik).then(data => {
        console.log("CREATED USER");
        res.redirect('/');
    }).catch(err => {
        vrniNapako(res, err);
    });
};

//** POST /settings
module.exports.posodobiOsebnePodatke = function(req, res, next) {
    if (checkIfLogged(res, req) != 0) return; 
    let updateUporabnik = {
        ime: req.body.set_name,
        email: req.body.set_email,
        telefon: req.body.set_phone,
        vrsta: parseInt(req.body.izbranaVrsta),
    };
    if(req.body.reg_password) updateUporabnik.geslo = req.body.set_password;
    if(req.body.avatar) updateUporabnik.slika = ""+req.body.avatar;
    let conditions = { _id: req.session.trenutniUporabnik.id };
    Uporabnik.findOneAndUpdate(conditions, updateUporabnik,{upsert: true, runValidators: true}, function (err, doc) { // callback
        if (err) {
            console.log(err);
            vrniNapako(res, err);
        } else {
            //successfulPost = 1;
            res.redirect('/')
        }
    });
};


//** POST /notifications
module.exports.posodobiObvestila = function(req, res, next) {
    if (checkIfLogged(res, req) != 0) return;   
    let mail = false, tel = false;
    if (req.body.switchMail) mail = true;
    if (req.body.switchSms) tel = true;
    let conditions = { _id: req.session.trenutniUporabnik.id };
    Uporabnik.find(conditions, { notf_telefon: 1, notf_email: 1 }).then(notif => {
        console.log("test");
        let updateUporabnik = {};
        if (notif[0].notf_telefon != tel) {
            updateUporabnik.notf_telefon = tel;
            if(tel == true) {
                if (jobs[req.session.trenutniUporabnik.id+"sms"]) {
                    req.session.trenutniUporabnik.notf_telefon = false;
                    jobs[req.session.trenutniUporabnik.id+"sms"].start();
                } else {
                    console.log("cron sms");
                    jobs[req.session.trenutniUporabnik.id+"sms"] = new CronJob({
                        cronTime: '00 00 08 * * *',
                        onTick: function() {
                            let name = "MyFamily";
                            let number = 051757557; //user number
                            let text = "Današjni dan: 12:00 Pospravi smeti, Odnesi smeti, Fizična aktivnost 19:00 - 20:30";
                            sendMessage(name, number, text);
                            /* Runs every day (Monday through Sunday) */
                        },
                        start: true,
                        timeZone,
                        context: {jobName: req.session.trenutniUporabnik.id}
                        });
                }                    
            } else {
                if (jobs[req.session.trenutniUporabnik.id+"sms"]) {
                    req.session.trenutniUporabnik.notf_telefon = false;
                    jobs[req.session.trenutniUporabnik.id+"sms"].stop();
                }                
            }
        }            
        if (notif[0].notf_email != mail) { 
            updateUporabnik.notf_email = mail;
            if(mail == true) {
                if (jobs[req.session.trenutniUporabnik.id+"email"]) {
                    req.session.trenutniUporabnik.notf_email = true;
                    jobs[req.session.trenutniUporabnik.id+"email"].start();
                } else {
                    var mailOptions = {
                        from: 'MyFamilyAppMail@gmail.com',
                        to: req.session.trenutniUporabnik.email,
                        subject: 'Dnevni opomnik'
                        };
                    jobs[req.session.trenutniUporabnik.id+"email"] = new CronJob({
                        cronTime: "00 30 08 * *",
                        onTick: function() {
                            console.log("sending mail");
                            mailOptions.text = 'Današjni dan: 12:00 Pospravi smeti, Odnesi smeti, Fizična aktivnost 19:00 - 20:30';
                            transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);                            }
                            });
                                                      
                        },
                        start: true,
                        context: {jobName: req.session.trenutniUporabnik.id}
                        });
                }                 
            } else {
                if (jobs[req.session.trenutniUporabnik.id+"email"]) {
                    //console.log("job exists");
                    jobs[req.session.trenutniUporabnik.id+"email"].stop(); 
                }
                req.session.trenutniUporabnik.notf_email = false;
            } 
        }
        if(updateUporabnik) {
            Uporabnik.findOneAndUpdate(conditions, updateUporabnik,{upsert: false, runValidators: true}, function (err, doc) { // callback
                if (err) {
                    console.log(err);
                    vrniNapako(res, err);
                } else {
                    //successfulPost = 1;
                    res.redirect('/')
                }
            });
        }    
    }).catch(err => {
        vrniNapako(res, err);
    });   
};

//** POST /koledar/:koledarId
module.exports.prikaziKoledar = function(req, res, next) {
    if (checkIfLogged(res, req) != 0) return;  
    currentTab = 1;
    return queryNaloge({_id: req.params.koledarId}, {}).then(function(naloge) {
        return queryKategorija({_id: naloge[0].kategorija}, {}).then(function(kategorija) {
            naloge[0].vezani_uporabniki.unshift(naloge[0].avtor);
            return queryUporabniki({_id: naloge[0].vezani_uporabniki}, {slika: 1, ime: 1}).then(function(users) {
                res.render("pages/nalogakoledar", {naloge: naloge, moment : moment, kategorija : kategorija[0].ime, vezani: users});
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

//** POST /prikazi_naloge
module.exports.prikaziNaloge = function(req, res, next) {
    if (checkIfLogged(res, req) != 0) return;  
    currentTab = 2;
    let where_search = {};
    where_search.druzina = mongoose.Types.ObjectId(req.session.trenutniUporabnik.druzina);
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
    async.parallel({
        docs: function (cb) { Naloge.find(where_search).exec(cb);},
        kategorija: function (cb) { Kategorija.find().exec(cb); },
        uporabnik: function (cb) { Uporabnik.find({druzina: mongoose.Types.ObjectId(req.session.trenutniUporabnik.druzina)}).select("slika ime").exec(cb); },
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
    if (checkIfLogged(res, req) != 0) return;
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
        status: req.body.newStatus,
        druzina: mongoose.Types.ObjectId(req.session.trenutniUporabnik.druzina),
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
    let conditions = { _id: req.body.newDialog};
    Naloge.findOneAndUpdate(conditions, novaNaloga,{upsert: true, runVlidators: true}, {returnNewDocument: true}, function (err, doc) { // callback
        if (err) {
            vrniNapako(res, err);
            console.log(err);
            return;
        } else {
            //Iščem cilj, pod katerega je bila dodana naloga, uporabnikom prištejem vrednost za naloge, ki so jih naredili
            Cilji.findOne({_id: req.body.sampleCilj}, function(err, cilj) {
                if(!err) {
                    let obj = cilj.vezani_uporabniki.map(value => String(value.id_user));
                    if(!obj) obj = {};
                    for(let i = 0; i<novaNaloga.vezani_uporabniki.length; i++) {
                        let index = obj.indexOf(String(novaNaloga.vezani_uporabniki[i]));
                        if (index > -1) {
                            //prištejem točke
                            cilj.vezani_uporabniki[index].xp_user += currXp;
                        } else {
                            //Če uporabnik še ni v cilju, ga dodam
                            cilj.vezani_uporabniki.push({"id_user" : novaNaloga.vezani_uporabniki[i], "xp_user" : currXp});
                        }
                    }
                    obj = cilj.vezane_naloge.map(value => String(value.id_nal));
                    //console.log(doc, "doc");
                    //console.log(doc._id, "id");

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
                    //console.log(cilj);
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
    if (checkIfLogged(res, req) != 0) return;    
    currentTab = 3;
    validateImeOpisId(req,res);
    if(!validator.isInt(req.body.xpNaloge)) {vrniNapako(res, "Dovoljene so samo cele številke.");return false;}
    let updated = dateNow();
    let novCilj = {
        ime: req.body.imeDialog,
        opis: req.body.opisDialog,
        last_updated: updated,
        skupni_cilj: req.body.skupnaNaloga,
        maxXp: req.body.xpNaloge,
        druzina: mongoose.Types.ObjectId(req.session.trenutniUporabnik.druzina)
    };
    if(req.body.newDialog) {
        if(req.body.stanje) {
            novCilj.konec = updated;
        }
    } else {
        novCilj.zacetek = updated;
    }

    let conditions = { _id: req.body.newDialog };
    Cilji.findOneAndUpdate(conditions, novCilj,{upsert: true, runValidators: true}, function (err, doc) { // callback
        if (err) {
            vrniNapako(res, err);
        } else {
            successfulPost = 1;
            res.redirect('/')
        }
    });
};

//** POST /invite
module.exports.povabiUporabnika = function (req, res, next) {
    if(!validator.isEmail(req.body.invite_email)) {vrniNapako(res, "Vpisan email ni ustrezen. "+req.body.invite_email);return false;}
    console.log(req.body.invite_email);
    var mailOptions = {
        from: 'MyFamilyAppMail@gmail.com',
        to: req.body.invite_email,
        subject: 'MyFamily family invite'
    };

    console.log("sending mail");
    mailOptions.html = '<p>Pozdravljen,<br/><br/>Vabim te, da se mi pridužiš kot član družine v aplikaciji MyFamily. Prijavi se v aplikacijo in klikni na spodnjo povezavo.<br/><br/><a href="http://localhost:3000/invite/'+req.session.trenutniUporabnik.druzina+'">Pridruži se družini</a></p>';
    console.log(mailOptions.html);
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error, "error");
        } else {
            console.log('Email sent: ' + info.response);                           
        }
        console.log(info, "info");
    });
    console.log("what");
    res.redirect('/');
};


//** GET /api/:druzinaId
module.exports.spremeniDruzino = function (req, res, next) {
    if (checkIfLogged(res, req) != 0) return;  
    req.session.trenutniUporabnik.druzina = req.params.druzinaId;
    Uporabnik.findOne({_id:  req.params.druzinaId}).then(user => {
        user.druzina = req.params.druzinaId;
        user.save;         
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        vrniNapako(res, err);
        return;
    });

};

//** POST /status
module.exports.shraniStatus = function (req, res, next) {
    if (checkIfLogged(res, req) != 0) return;   
    if(req.body.currStatus) {
        Uporabnik.findOneAndUpdate({_id: req.session.trenutniUporabnik.id}, {status: req.body.currStatus}, { upsert: true}, function(err,doc) {     
            if (err) {
                res.status(400).end();
            } else {
                res.status(200).end();
            }
        });
    }
};





//** GET /odjava

module.exports.odjava = function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
};

function validatenaloga(req,res) {
    if(!validateImeOpisId(req,res)) return false;
    if(!validator.isMongoId(req.body.sampleKategorija)) {vrniNapako(res, "Za kategorijo so bili uporabljeni napačni znaki. "+req.body.sampleKategorija);return false;}
    if(!validator.isInt(req.body.xpNaloge, [{ min: 1, max: 100 }])) {vrniNapako(res, "Izbrana vrednost mora biti med 1 in 100 xp.");return false;}
    if(!validator.isMongoId(req.body.sampleCilj)) {vrniNapako(res, "Za vezan cilj so bili uporabljeni napačni znaki. "+req.body.sampleCilj);return false;}
    return true;
}

function validateImeOpisId(req,res) {
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

function sendMessage(name, number, text){
    return smsapi.message
        .sms()
        .from(name)
        .to(number)
        .message(text)
        .execute(); // return Promise
}

function displayResult(result){
    console.log(result);
}

function displayError(err){
    console.error(err);
}

function queryNaloge(query, fields) {
    return new Promise(function(resolve, reject) {
        Naloge.find(query, fields, function(err, result){
            if (err) {
                throw err;
                reject(err);
            }
            resolve(result);
        });
    });
}

function queryKategorija(query, fields) {
    return new Promise(function(resolve, reject) {
        Kategorija.find(query, fields, function(err, result){
            if (err) {
                throw err;
                reject(err);
            }
            resolve(result);
        });
    });
}

function queryUporabniki(query, fields) {
    return new Promise(function(resolve, reject) {
        Uporabnik.find(query, fields, function(err, result){
            if (err) {
                throw err;
                reject(err);
            }
            resolve(result);
        });
    });
}

function checkIfLogged(res, req) {
    if(!req.session.trenutniUporabnik) {
        console.log("User is not logged!");
        res.render('pages/prijava', {
            uporabnik: "",
            sporociloPrijava : "",
            currSession:  "",
        });
        return 1;
    }
    return 0;
}
