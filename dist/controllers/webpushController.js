let mongoose = require('mongoose');
let request = require('request');

let Subscription = mongoose.model("Subscription");
let Naloge = mongoose.model("Naloge");
let Cilji = mongoose.model("Cilji");
let Uporabnik = mongoose.model("Uporabnik");


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
  Uporabnik.find({email: req.body.email}, function (err, uporabniki) {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      if (uporabniki.email == req.body.email) {
        console.log("created token", uporabniki._id);
        res.status(200).send({ token: uporabniki._id});
      }
    }
  });
};

//** GET /api/naloge/:userId
module.exports.posljiNaloge = function (req, res) {

  let query = {};
  if(req.params.userId) query = { vezani_uporabniki: {$in: [req.params.userId]}};
  Naloge.find(query, function (err, doc) {
    if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        res.status(200).send(doc);
      }
  });
};

//** GET /api/cilji/:userId
module.exports.posljiCilje = function (req, res) {
  let query = {};
  if(req.params.userId) query = { "vezani_uporabniki.id_user" : {$in: [req.params.userId]}};
  Cilji.find(query, function (err, doc) {
    if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        res.status(200).send(doc);
      }
  });
};

//** POST /api/koraki/
module.exports.prejmiKorake = function (req, res) {
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

//** POST /api/naloga/
module.exports.prejmiNalogo = function (req, res) {
  console.log(req.body);
  request.post(
    'https://ekosmartweb.herokuapp.com/ustvari_nalogo',
    { json: { mode: 'api', newDialog: req.body.idNaloge, } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("dela");
          res.sendStatus(200);
        } else {
          console.log("ne dela");
          res.sendStatus(404);
        }
    }
  );
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


  function hash(inp) {
    let hs = 0, i, chr;
    for (i = 0; i < inp.length; i++) {
        chr = inp.charCodeAt(i);
        hs = ((hs << 5) - hs) + chr;
        hs |= 0; // Convert to 32bit integer
    }
    return hs;
};



