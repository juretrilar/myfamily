let mongoose = require('mongoose');
//let request = require('request');

let Subscription = mongoose.model("Subscription");
let Naloge = mongoose.model("Naloge");
let Cilji = mongoose.model("Cilji");
let Uporabnik = mongoose.model("Uporabnik");
let Kategorija = mongoose.model("Kategorija");
let Koraki = mongoose.model("Koraki");

let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');

let config = require('../config');

let webpush = require('web-push');
let moment = require('moment');

let nodemailer = require('nodemailer');
let sparkPostTransport = require('nodemailer-sparkpost-transport')
let transporter = nodemailer.createTransport(sparkPostTransport({
  'sparkPostApiKey': process.env.SPARKPOST_API_KEY || "this is a false api"
}))

//** POST /api/save-subscription
module.exports.dodajObvestila = function (req, res) {
    let isValidSaveRequest = (req, res) => {
        // Check the request body has at least an endpoint.
        if (!req.body || !req.body.endpoint) {
          // Not a valid subscription.
          res.status(400);
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({
            error: {
              id: 'no-endpoint',
              message: 'Subscription must have an endpoint.'
            }
          }));
          return false;
        }
        return true;
    };
    if (isValidSaveRequest) {
        return saveSubscriptionToDatabase(req.body)
        .then(function(subscriptionId) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: { success: true } }));
        })
        .catch(function(err) {
            console.log(err);
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                error: {
                    id: 'unable-to-save-subscription',
                    message: 'The subscription was received but we were unable to save it to our database.'
                }
            }));
        });
    }
};
  
  //** POST /api/disable-subscription
module.exports.odstraniObvestila = function (req, res) {
    let isValidSaveRequest = (req, res) => {
        // Check the request body has at least an endpoint.
        if (!req.body || !req.body.endpoint) {
          // Not a valid subscription.
          res.status(400);
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({
            error: {
              id: 'no-endpoint',
              message: 'Subscription must have an endpoint.'
            }
          }));
          return false;
        }
        return true;
    };
    if (isValidSaveRequest) {
        const endpoint = req.body;
        Subscription.findOneAndRemove({endpoint: endpoint.subscription.endpoint}, function (err,data){
            if(err) { 
            console.log(err);
            console.error('error with unsubscribe', error);
            res.status(500).send('unsubscription not possible'); 
            }
            console.log('unsubscribed');
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: { success: true } }));
        });
    }
};

//** POST /api/prijava
module.exports.posljiToken = function (req, res) {  
  if (req.headers.email && req.headers.password) {
    console.log(req.headers.email);
    Uporabnik.find({email: req.headers.email}, function (err, uporabniki) {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        if(uporabniki[0]) {
          try {
            if (uporabniki[0].email == req.headers.email && bcrypt.compareSync(req.headers.password, uporabniki[0].geslo)) {
              let user = {};
              let token = jwt.sign({ id: uporabniki[0]._id }, config.secret, {    // create a token
                expiresIn: 86400 // expires in 24 hours
              });
              let obj = {3 : "Vnuk/Vnukinja", 4 : "Sin/Hči", 5: "Oče/Mati", 6: "Dedek/Babica", 7: "Pradedek/Prababica"};
              user.auth = true;
              user.token = token;
              user._id  = uporabniki[0]._id;
              user.email = uporabniki[0].email;
              user.ime =  uporabniki[0].ime;
              user.druzina = uporabniki[0].druzina;
              user.polozaj = obj[uporabniki[0].polozaj];
              user.telefon = uporabniki[0].telefon;
              user.slika = uporabniki[0].slika;
              res.status(200).send(user);
            } else {
              res.sendStatus(401);
            }
          } catch (error) {
            res.status(404).send(error);
          }
        } else {
          res.status(404).send(err);
        }
      }
    });
  } else {
    res.sendStatus(404);
  }
};

//** GET /api/naloge/:userId
module.exports.posljiNaloge = function (req, res) {
  let query = {};
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      query = { vezani_uporabniki: {$in: [mongoose.Types.ObjectId(req.params.userId)]}};
      Naloge.find(query, function (err, doc) {
        if (err) {
            console.log(err);
            res.status(404).send(err);
          } else {
            res.status(200).send(doc);
          }
      });
    });
  } else {
    res.status(401).send({ auth: false, message: 'No token provided.' });  
  }
};

//** GET /api/cilji/:userId
module.exports.posljiCilje = function (req, res) {
  let query = {};
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      query = { "vezani_uporabniki.id_user" : {$in: [mongoose.Types.ObjectId(req.params.userId)]}};
      Cilji.find(query, function (err, doc) {
        if (err) {
          console.log(err);
          res.status(404).send(err);
        } else {
          res.status(200).send(doc);
        }
      });
    });
  } else {
    res.status(401).send({ auth: false, message: 'No token provided.' });  
  }
};

//** GET /api/kategorije
module.exports.posljiKategorije = function (req, res) {
  Kategorija.find(function (err, kat) {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      res.status(200).send(kat);
    }
  });
};


//** POST /api/koraki/
module.exports.prejmiKorake = function (req, res) {
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      Koraki.find(function (err) {
        if (err) {
          console.log(err);
          res.status(404).send(err);
        } else {
          res.status(200).send(req.body);
        }
      });      
    }); 
  } else {
    res.status(401).send({ auth: false, message: 'No token provided.' });  
  }
};

//** GET /api/druzina/:druzinaId
module.exports.posljiDruzino = function (req, res) {
  
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      Uporabnik.find({druzina: req.params.druzinaId},{ id: 1, ime: 1, druzina: 1, polozaj: 1, slika: 1, telefon: 1, email: 1}, function (err, uporabniki) {
        if (err) {
          console.log(err);
          res.status(404).send(err);
        } else {
          let newObj = [];
          let obj = {3 : "Vnuk/Vnukinja", 4 : "Sin/Hči", 5: "Oče/Mati", 6: "Dedek/Babica", 7: "Pradedek/Prababica"};
          for (let i=0;i<uporabniki.length;i++) {
            newObj.push({_id : uporabniki[i]._id, ime : uporabniki[i].ime, email: uporabniki[i].email, telefon: uporabniki[i].telefon, druzina: uporabniki[i].druzina, polozaj: obj[uporabniki[i].polozaj], slika: uporabniki[i].slika});
          }
          res.status(200).send(newObj);
        }
      });
    });
  } else {
    res.status(401).send({ auth: false, message: 'No token provided.' });  
  }
};


//** POST /api/naloga/:idNaloge
module.exports.prejmiNalogo = function (req, res) {
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      let novaNaloga = {
        status: true,
      };
      let conditions = { _id: req.params.idNaloge };
    Naloge.findOneAndUpdate(conditions, novaNaloga, { upsert: true,new: true, runVlidators: true}, function (err, doc) { // callback
      if (err) {
          console.log(err);
          return res.status(400).send("Pri shranjevanju naloge je prišlo do napake!");
      } else {   
        let updt, upXp;
        if (doc) {
          updt = doc.vezani_uporabniki;
          upXp = doc.xp;
        }
        if (updt && upXp) {
          Uporabnik.update({ _id: { $in: updt } }, { $inc: { dayXp: upXp } }, { multi: true }, function (err, docs) {
              if (err) {
                  console.log(err);
                  return res.status(400).send("Pri shranjevanju točk je prišlo do napake!");
              }
          });
        }
          //Iščem cilj, pod katerega je bila dodana naloga, uporabnikom prištejem vrednost za naloge, ki so jih naredili
          let obj = {}, curObj = {};
        Cilji.findOne({ _id: doc.vezan_cilj }, function (err, cilj) {
          if (!err) {
              if(cilj.vezani_uporabniki) obj = cilj.vezani_uporabniki.map(value => String(value.id_user)); //Error
              if(doc.vezani_uporabniki) curObj = doc.vezani_uporabniki.map(value => String(value));
              for (let i = 0; i < curObj.length; i++) {
                  let index = obj.indexOf(String(curObj[i]));
                  if (index > -1) { //prištejem točke                               
                      cilj.vezani_uporabniki[index].xp_user = parseInt(cilj.vezani_uporabniki[index].xp_user) + doc.xp;
                  } else {  //Če uporabnik še ni v cilju, ga dodam                 
                        cilj.vezani_uporabniki.push({ "id_user": doc.vezani_uporabniki[i], "xp_user": doc.xp });
                  }                          
              }
              //console.log("Osvežim točke cilja");               
              obj = cilj.vezane_naloge.map(value => String(value.id_nal));
              let nalId = req.params.idNaloge;
              if (obj) {
                  let index = obj.indexOf(nalId);
                  if (index > -1) {
                      cilj.vezane_naloge[index].stanje = true;
                  } else {
                      cilj.vezane_naloge.push({ "id_nal": nalId, "stanje": true });
                  }
              }
              cilj.save(function (err) {
                if (!err) {
                    if (doc) {
                      return res.status(200).send("Naloga je bila uspešno posodobljena!");
                    } else {
                      return res.status(200).send("Naloga je bila uspešno ustvarjena!");
                    }
                }
                else {
                  console.log(err);
                  return res.status(400).send("Pri shranjevanju naloge je prišlo do napake!");
                }
              });
            } else {
                console.log(err);
                return res.status(400).send("Pri shranjevanju naloge je prišlo do napake!");
            }
          });
        }
        if (doc) {
          return res.status(200).send("Naloga je bila uspešno posodobljena!");
        } else {
          return res.status(200).send("Naloga je bila uspešno ustvarjena!");
        }      
      });
    });
  } else {
    res.status(401).send('No token provided.');  
  }  
};

/** GET /api/change/ */
module.exports.changePassword = function (req,res) {
  if (req.query.token) {
    jwt.verify(req.query.token, config.secret, function(err, decoded) {
      if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      res.render("pages/prijava", {isLoggedIn: false,
        uporabniki: 0,
        uporabnik: "",
        sporociloPrijava: "",
        currSession: "",
        email: "",
        changePass: true,
      });
    });  
  } else {
    res.status(401).send('No token provided.' );  
  }    
}

/** POST /api/confirm/ */
module.exports.confirmPassword = function (req,res) {
  if (req.query.token && req.body.password) {
    jwt.verify(req.query.token, config.secret, function(err, decoded) {
      if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
      Uporabnik.findOne({email: decoded.email}, function (err, uporabnik) {
        if (err) {
          console.log(err);
          res.status(404).send("Uporabnik s tem e-mail naslovom ne obstaja!");
        } else {
          uporabnik.geslo = bcrypt.hashSync(req.body.password, 8);
          uporabnik.save(function (err) {
            if (!err) {
                return res.status(200).send("Geslo je bilo uspešno posodobljeno!");
            }
            else {
                console.log(err);
                return res.status(400).send("Pri posodabljanju gesla je prišlo do napake!");
            }
        });
          res.status(200).send("Geslo je bilo uspešno posodobljeno!"); 
        }
      });
    });  
  } else {
    res.status(401).send('No token provided.' );  
  }    
}



/** POST /api/reset_password/ */
module.exports.resetPassword = function (req,res) {
  Uporabnik.findOne({email: req.body.email}, function (err, uporabniki) {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      if(uporabniki) {
        let token = jwt.sign({ email: req.body.email }, config.secret, {    // create a token
          expiresIn: 3600 // expires in 1 hour
        });
        let vsebina = '<p>Nekdo (predvidoma vi) je zahteval ponastavitev gesla za uporabniški račun '+req.body.email+' v aplikaciji MyFamily. Do sedaj v računu ni bilo sprememb.'+
        '<br/><br/>'+
        'Če želite ponastaviti geslo, kliknite na spodnjo povezavo in si izberite novo geslo.'+
        '<br/>'+
        '<a href="https://ekosmartweb.herokuapp.com/api/change?token='+token+'">Ponastavi geslo</a>'+
        '<br/><br/>'+
        'Če niste vi zahtevali novega gesla, oziroma ga ne želite spremeniti, potem to sporočilo ignorirajte. Povezava bo po 1 uri deaktivirana.'+
        '<br/><br/>'+
        'Lep pozdrav,'+
        '<br/>'+
        'Ekipa MyFamily</p>';    
        mailOptions = {
            from: 'MyFamily@'+process.env.SPARKPOST_DOMAIN,
            to: req.body.email,
            subject: "Zahteva za ponastavitev gesla",
            html: vsebina,
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.status(200).send("Zahtevek za ponastavitev gesla je bil poslan na vaš naslov!")
      } else {
        res.status(404).send("Uporabnik s tem e-mail naslovom ne obstaja!");
      }
    }
  });
}



/** GET /api/send_mail/ */
module.exports.posljiMail = function (req,res) {
  Uporabnik.find({ notf_email: true }, function (err, emailusers) {
      if (err) {
          console.log(error);
          return;
      }
      for(let j = 0; j < emailusers.length; j++) {
          Naloge.find({ vezani_uporabniki: emailusers[j]._id }, function (err, naloga) {
              if (err) {
                res.status(404).end();
              }
              let idx = {};
              if (naloga.length == 0) {
              } else {
                  for (let i = 0; i < naloga.length; i++) {
                      let zac = moment(naloga[i].zacetek).format('MM-DD-YYYY');
                      //let kon = moment(naloga[i].konec).format('MM-DD-YYYY');
                      let now = moment(Date.now()).format('MM-DD-YYYY');
                      if (zac && naloga[i].status == false) { // Če je naloga na današnji dan jo dodaj v opomnike
                          //console.log(zac, now, moment.duration(moment(zac).diff(moment(now))));
                          idx[Math.abs(moment.duration(moment(zac).diff(moment(now))))] = naloga[i];
                      }
                  }
                  let length = (Object.values(idx).length > 5) ? 5 : Object.values(idx).length;
                  if (Object.values(idx)) {                              
                    let vsebina = 'Opomniki za nedokončane naloge:\n\n';
                    for (let i=0; i<length; i++) {
                        vsebina += "Ime: "+Object.values(idx)[i].ime+"\nOpis: "+Object.values(idx)[i].opis+"\nZačetek: "+moment(Object.values(idx)[i].zacetek).format("D. M ob HH:mm")+
                        "\nKonec: "+moment(Object.values(idx)[i].konec).format("D. M ob HH:mm")+"\nTočk: "+Object.values(idx)[i].xp+"\n\n";
                    }
                    mailOptions = {
                        from: 'MyFamily@'+process.env.SPARKPOST_DOMAIN,
                        to: emailusers[j].email,
                        subject: "Opomnik " + moment(new Date()).format('M. D'),
                        text: vsebina,
                    }
                    console.log("Sending mail to user", mailOptions);
                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                          console.log(error);
                          res.status(404).end();
                      } else {
                          console.log('Email sent: ' + info.response);
                          res.status(200).end();
                      }
                    });
                  }
              }
          });
      }
  });
}


/*
//** POST /api/trigger-push-msg
module.exports.posljiObvestila = function (req, res) {
    return getSubscriptionsFromDatabase()
    .then(function(subscriptions) {
      let promiseChain = Promise.resolve();
  
      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        promiseChain = promiseChain.then(() => {
          return triggerPushMsg(subscription, dataToSend);
        });
      }
  
      return promiseChain;
    })
    .then(() => {
        res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ data: { success: true } }));
      })
      .catch(function(err) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          error: {
            id: 'unable-to-send-messages',
            message: `We were unable to send messages to all subscriptions : ` +
              `'${err.message}'`
          }
        }));
      });
}
*/

function saveSubscriptionToDatabase(subscription) {
    return new Promise(function(resolve, reject) {
        const endpoint = subscription;
        console.log(subscription);
        let subscriptionModel = new Subscription({  
            user_id: endpoint.user_id,
            endpoint: endpoint.subscription.endpoint,
            keys: {
              p256dh: endpoint.subscription.keys.p256dh,
              auth: endpoint.subscription.keys.auth
            }
        });
        console.log(subscriptionModel);
        subscriptionModel.save(function (err, push) {
            if (err) {
              console.error('error with subscribe', error);
              res.status(500).send('subscription not possible');
              return;
            }
            resolve(subscriptionModel._id);
      });
    });
  };



function triggerPushMsg(subscription, payload) {
  let options = {
      TTL: 3600 // 1sec * 60 * 60 = 1h
  };

  return webpush.sendNotification(
      subscription, 
      payload,
      options
  ).catch((err) => {
      if (err.statusCode === 410) {
          return deleteSubscriptionFromDatabase(subscription._id);
      } else {
          console.log('Subscription is no longer valid: ', err);
      }
  });
};


