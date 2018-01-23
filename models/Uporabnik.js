let mongoose = require("mongoose");

let uporabnikSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: {type: String, required: true},
    druzina: {type: mongoose.Schema.Types.ObjectId, required: true},
    geslo: {type: String, required: true },
    email: {type: String, required : true, unique: true},
    telefon: {type: Number},
    admin: Boolean,
    slika: String,
    created_at: Date,
    last_login: Date
});

mongoose.model('Uporabnik', uporabnikSchema, 'Uporabnik');
