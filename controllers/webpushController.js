let Subscription = require('../models/Subscription');

let webpush = require('web-push');


//** POST /api/save-subscription
module.exports.dodajObvestila = function (req, res) {
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

            const payload = JSON.stringify({
                title: 'Welcome',
                body: 'Thank you for enabling push notifications',
                icon: '/android-chrome-192x192.png'
            });

            let options = {
                TTL: 3600 // 1sec * 60 * 60 = 1h
            };

            const subscription = {
                endpoint: push.endpoint,
                keys: {
                p256dh: push.keys.p256dh,
                auth: push.keys.auth
                }
            };
    
            webPush.sendNotification(
                subscription, 
                payload,
                options
                ).then(function() {
                    console.log("Send welcome push notification");
                    res.status(200).send('subscribe');
                    return;
                }).catch(err => {
                    console.error("Unable to send welcome push notification", err );
                    res.status(500).send('subscription not possible');
                    return;
            });
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
