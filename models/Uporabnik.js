let mongoose = require("mongoose");

let uporabnikSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: {type: String, required: true},
    druzina: {type: mongoose.Schema.Types.ObjectId, required: true},
    polozaj: {type: Number, required: true},
    geslo: {type: String, required: true },
    email: {type: String, required : true, unique: true},
    viber: String,
    telefon: String,
    notf_telefon: Boolean,
    notf_email: Boolean,
    admin: Boolean,
    slika: Number,
    status: String,
    dayXp: Number,
    koraki: Number,
    created_at: Date,
    last_login: Date
});

let Uporabnik = mongoose.model('Uporabnik', uporabnikSchema, 'Uporabnik');