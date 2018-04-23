let webpush = require('web-push');
let mongoose = require('mongoose');

let Subscription = mongoose.model("Subscription");

webpush.setVapidDetails(
    'mailto:myFamilyAppMail@gmail.com',
    'BGa5M248kds3Uw6AkR6igb3aq4OQw1zFmSBNuFj10kwdsqZ8DXoYtvLUPCMsUIpMKQiPzdOY-s-3mkVnPhRUiQg' || process.env.VAPID_PUBLIC_KEY,
    'Ue3ZsN1R_48R17QCxR4vZHuNQu9gKspmVIVMwai-hPQ' || process.env.VAPID_PRIVATE_KEY
  );


//** POST /api/save-subscription
module.exports.dodajObvestila = function (req, res) {
    console.log(req.body, "zacetek");
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
    console.log(req.body);
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
        const endpoint = req.body.endpoint;

        Subscription.findOneAndRemove({endpoint: endpoint}, function (err,data){
            if(err) { 
            console.error('error with unsubscribe', error);
            res.status(500).send('unsubscription not possible'); 
            }
            console.log('unsubscribed');
            res.status(200).send('unsubscribe');
        });
    }
};

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

function triggerPushMsg(subscription, dataToSend) {
    const payload = JSON.stringify({
        title: 'Welcome',
        body: 'Thank you for enabling push notifications',
        icon: 'images/f.ico'
    });

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


function saveSubscriptionToDatabase(subscription) {
    return new Promise(function(resolve, reject) {
        const endpoint = req.body;

        let subscriptionModel = new Subscription({  
            endpoint: endpoint.endpoint,
            keys: {
              p256dh: endpoint.keys.p256dh,
              auth: endpoint.keys.auth
            }
        });
        
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






