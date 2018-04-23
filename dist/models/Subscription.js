let mongoose = require('mongoose');

var subscriptionSchema = new mongoose.Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  }
});

mongoose.model('Subscription', subscriptionSchema, 'Subscription');

