let mongoose = require("mongoose");

let korakiSchema = new mongoose.Schema({
    uporabnik: {type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"},
    druzina: {type:String, required: true},
    koraki: [Number, Number, Number, Number, Number, Number, Number]
});

mongoose.model('Koraki', korakiSchema, 'Koraki');