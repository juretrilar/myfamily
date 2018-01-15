let mongoose = require("mongoose");

let nalogeSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: { type:String, required: true, unique: true},
    opis: String,
    kategorija: String,
    zacetek: Date,
    konec: Date,
    xp: Number,
    vezan_cilj : {type : mongoose.Schema.Types.ObjectId, ref : "Cilji"},
    vezani_uporabniki: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    avtor: {type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"},
    opravljen: Boolean
});

mongoose.model('Naloge', nalogeSchema, 'Naloge');
