let mongoose = require("mongoose");

let ciljiSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: { type:String, required: true, unique: true},
    opis: String,
    zacetek: Date,
    konec: Date,
    xp: Number,
    vezane_naloge: [{type : mongoose.Schema.Types.ObjectId, ref : "Naloge"}],
    vezani_uporabnik: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    status: Boolean
});

mongoose.model('Cilji', ciljiSchema, 'Cilji');


