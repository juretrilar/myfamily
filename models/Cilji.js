let mongoose = require("mongoose");

let ciljiSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: { type:String, required: true, unique: true},
    opis: { type:String, required: true},
    zacetek: { type:Date, default: Date.now },
    konec: { type:Date },
    xp: Number,
    vezane_naloge: [{naloga : {type: mongoose.Schema.Types.ObjectId, ref : "Naloge"}, stanje: Boolean}],
    vezani_uporabniki: [{user : {type: mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}, uXp: Number}],
    skupni_cilj: Boolean,
    status: Boolean
});

mongoose.model('Cilji', ciljiSchema, 'Cilji');


