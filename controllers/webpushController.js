let mongoose = require('mongoose');

let Subscription = mongoose.model("Subscription");
let Naloge = mongoose.model("Naloge");


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
//** GET /api/get-tasks/:kategorijaId
module.exports.posljiNaloge = function (req, res) {
  let query = {};
  if(req.params.kategorijaId) query = {kategorija: req.params.kategorijaId};
  Naloge.find(query,{ ime: 1, opis: 1, kategorija: 1 }, function (err, doc) {
    if (err) {
        console.log(err);
        res.status(404);
      } else {
        res.send(doc);
      }
  });
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






