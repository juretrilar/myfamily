#!/app/bin/env node

require( '../models/db' );

var mongoose = require( 'mongoose' );
let Uporabnik = mongoose.model("Uporabnik");

console.log("Deleting daily xp");
deleteXP();
console.log("Daily xp deleted");


//DELETE DAILY XP
function deleteXP() {
    Uporabnik.where().updateMany({ $set: { "dayXp": 0 } }, function (err, res) {
        if (err) {
            console.log(err);
        } else { console.log(res); }
    });
}