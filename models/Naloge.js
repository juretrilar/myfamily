let mongoose = require("mongoose");

let nalogeSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: { type:String, required: true},
    opis: String,
    kategorija: {type : mongoose.Schema.Types.ObjectId, ref : "Kategorija"},
    zacetek: Date,
    konec: Date,
    xp: Number,
    vezan_cilj : {type : mongoose.Schema.Types.ObjectId, ref : "Cilji"},
    avtor: {type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"},
    status: Boolean,
    vezani_uporabniki: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    druzina: {type: mongoose.Schema.Types.ObjectId},
});

mongoose.model('Naloge', nalogeSchema, 'Naloge');
