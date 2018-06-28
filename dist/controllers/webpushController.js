let mongoose = require('mongoose');
//let request = require('request');

let Subscription = mongoose.model("Subscription");
let Naloge = mongoose.model("Naloge");
let Cilji = mongoose.model("Cilji");
let Uporabnik = mongoose.model("Uporabnik");
let Kategorija = mongoose.model("Kategorija");

let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');

let config = require('../config');

let webpush = require('web-push');

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
    Uporabnik.find({email: req.headers.email}, function (err, uporabniki) {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        if (uporabniki[0].email == req.headers.email && bcrypt.compareSync(req.headers.password, uporabniki[0].geslo)) {
          let user = {};
          let token = jwt.sign({ id: uporabniki[0]._id }, config.secret, {    // create a token
            expiresIn: 86400 // expires in 24 hours
          });
          user.auth = true;
          user.token = token;
          user._id  = uporabniki[0]._id;
          user.email = uporabniki[0].email;
          user.ime =  uporabniki[0].ime;
          user.druzina = uporabniki[0].druzina;
          user.telefon = uporabniki[0].telefon;
          user.slika = uporabniki[0].slika;
          res.status(200).send(user);
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
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
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
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
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
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      res.status(200).send(req.body);
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
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      Uporabnik.find({druzina: req.params.druzinaId},{ id: 1, ime: 1, druzina: 1, polozaj: 1, slika: 1}, function (err, uporabniki) {
        if (err) {
          console.log(err);
          res.status(404).send(err);
        } else {
          let object = {3 : "Vnuk/Vnukinja", 4: "Sin/Hči", 5: "Oče/Mati", 6: "Dedek/Babica", 7: "Pradedek/Prababica"};
          for (let i=0;i<uporabniki.length;i++) {
              uporabniki[i].polozaj = object[""+uporabniki[i].polozaj+""];
          }
          res.status(200).send(uporabniki);
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
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      let novaNaloga = {
        status: true,
      };
      let conditions = { _id: req.params.idNaloge };
    Naloge.findOneAndUpdate(conditions, novaNaloga, { upsert: true,new: true, runVlidators: true}, function (err, doc) { // callback
      if (err) {
          console.log(err);
          return res.status(400).end("Pri shranjevanju naloge je prišlo do napake!");
          return;
      } else {
        if (doc) { //če je naloga opravljena pošljem obvestilo uporabnikom
          let arr = doc.vezani_uporabniki;
          let index = arr.indexOf(decoded._id);
          if (index !== -1) arr.splice(index, 1);
          Subscription.find({ user_id: arr }, function (err, sub) {
              if (err) {
                  console.log(err);
                  return;
              }
              console.log(sub,"sub");
              for(let m = 0; m < sub.length;m++) {
                  const payload = JSON.stringify({
                      title: 'Obvestilo',
                      body: 'Naloga '+doc.ime+' je bila opravljena. Dobili ste '+doc.xp+' točk!',
                      icon: 'images/f.ico'
                  });
                  triggerPushMsg(sub[m], payload);
              }
          });         
        }     
        let updt, upXp;
        if (doc) {
          updt = doc.vezani_uporabniki;
          upXp = doc.xp;
        }
        if (updt && upXp) {
          Uporabnik.update({ _id: { $in: updt } }, { $inc: { dayXp: upXp } }, { multi: true }, function (err, docs) {
              if (err) {
                  console.log(err);
                  return res.status(400).end("Pri shranjevanju točk je prišlo do napake!");
              }
          });
        }
          //Iščem cilj, pod katerega je bila dodana naloga, uporabnikom prištejem vrednost za naloge, ki so jih naredili
          let obj = {}, curObj = {};
        Cilji.findOne({ _id: doc.vezan_cilj }, function (err, cilj) {
          if (!err) {
              obj = cilj.vezani_uporabniki.map(value => String(value.id_user));
              curObj = doc.vezani_uporabniki.map(value => String(value));
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
                      return res.status(200).end("Naloga je bila uspešno posodobljena!");
                    } else {
                      return res.status(200).end("Naloga je bila uspešno ustvarjena!");
                    }
                }
                else {
                  console.log(err);
                  return res.status(400).end("Pri shranjevanju naloge je prišlo do napake!");
                }
              });
            } else {
                console.log(err);
                return res.status(400).end("Pri shranjevanju naloge je prišlo do napake!");
            }
          });
        }
        if (doc) {
          return res.status(200).end("Naloga je bila uspešno posodobljena!");
        } else {
          return res.status(200).end("Naloga je bila uspešno ustvarjena!");
        }      
      });
    });
  } else {
    res.status(401).send({ auth: false, message: 'No token provided.' });  
  }  
};


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