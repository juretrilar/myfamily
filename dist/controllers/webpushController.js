let mongoose = require('mongoose');
let request = require('request');

let Subscription = mongoose.model("Subscription");
let Naloge = mongoose.model("Naloge");
let Cilji = mongoose.model("Cilji");
let Uporabnik = mongoose.model("Uporabnik");
let Kategorija = mongoose.model("Kategorija");

let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');

let config = require('../config');

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

//** GET /api/naloge/
module.exports.posljiNaloge = function (req, res) {
  let query = {};
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      query = { vezani_uporabniki: {$in: [mongoose.Types.ObjectId(decoded.id)]}};
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

//** GET /api/cilji/
module.exports.posljiCilje = function (req, res) {
  let query = {};
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      query = { "vezani_uporabniki.id_user" : {$in: [mongoose.Types.ObjectId(decoded.id)]}};
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
      console.log(kat)
      res.status(200).send(kat);
    }
  });
};


//** POST /api/koraki/
module.exports.prejmiKorake = function (req, res) {
  console.log(req.headers);
  console.log(req.body);
  console.log("koraki delajo")
  res.sendStatus(200);
  /*
  Uporabnik.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.token)}, { koraki: req.body.koraki}, { upsert: true, runValidators: true }, function (err, doc) { // callback
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      console.l
      res.status(200);
    }
  });
  */
};

//** POST /api/naloga/:idNaloge
module.exports.prejmiNalogo = function (req, res) {
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      request.post('https://ekosmartweb.herokuapp.com/ustvari_nalogo').form({mode: 'api', newDialog: req.params.idNaloge});
      res.sendStatus(200);
      /*
      request.post(
        'localhost:3000/ustvari_nalogo',
        { json: { mode: 'api', newDialog: req.params.idNaloge, } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
              res.sendStatus(200);
            } else {
              console.log(error, response);
              res.sendStatus(404);
            }
        }
      );*/
    });
  } else {
    res.status(401).send({ auth: false, message: 'No token provided.' });  
  }




  console.log(req.body);
  
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



