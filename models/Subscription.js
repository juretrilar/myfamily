let mongoose = require('mongoose');

var subscriptionSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  }
});

mongoose.model('Subscription', subscriptionSchema, 'Subscription');

