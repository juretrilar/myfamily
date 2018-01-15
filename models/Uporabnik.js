let mongoose = require("mongoose");

let uporabnikSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: String,
    druzina: {type:String, required: true, unique: true},
    uporabnisko_ime: {type:String, required: true, unique: true},
    geslo: {type: String, required: true },
    email: {type: String, required : true},
    telefon: {type: Number},
    admin: Boolean,
    slika: String,
    created_at: Date,
    updated_at: Date
});

mongoose.model('Uporabnik', uporabnikSchema, 'Uporabnik');
