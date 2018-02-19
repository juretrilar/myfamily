let mongoose = require("mongoose");
let express = require('express');

let MONGODB_URI = "mongodb://localhost/myfamily-test";

if(process.env.NODE_ENV === "production"){
  MONGODB_URI = process.env.MLAB_URI;
}

mongoose.connect(MONGODB_URI, { useMongoClient : true });

mongoose.connection.on('connected', function() {
  console.log('Mongoose je povezan na ' + MONGODB_URI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose napaka pri povezavi: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose je zaprl povezavo');
});

let pravilnaUstavitev = function(sporocilo, povratniKlic) {
  mongoose.connection.close(function() {
    console.log('Mongoose je zaprl povezavo preko ' + sporocilo);
    povratniKlic();
  });
};

// Pri ponovnem zagonu nodemon
process.once('SIGUSR2', function() {
  pravilnaUstavitev('nodemon ponovni zagon', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// Pri izhodu iz aplikacije
process.on('SIGINT', function() {
  pravilnaUstavitev('izhod iz aplikacije', function() {
    process.exit(0);
  });
});

// Pri izhodu iz aplikacije na Heroku
process.on('SIGTERM', function() {
  pravilnaUstavitev('izhod iz aplikacije na Heroku', function() {
    process.exit(0);
  });
});

require("./Uporabnik");
require("./Cilji");
require("./Naloge");
require("./Druzina");