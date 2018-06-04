let mongoose = require("mongoose");

let uporabnikSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: {type: String, required: true},
    druzina: {type: mongoose.Schema.Types.ObjectId, required: true},
    vrsta: {type: Number, required: true},
    geslo: {type: String, required: true },
    email: {type: String, required : true, unique: true},
    viber: String,
    telefon: Number,
    notf_telefon: Boolean,
    notf_email: Boolean,
    admin: Boolean,
    slika: String,
    status: String,
    dayXp: Number,
    created_at: Date,
    last_login: Date
});

let Uporabnik = mongoose.model('Uporabnik', uporabnikSchema, 'Uporabnik');