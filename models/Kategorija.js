let mongoose = require("mongoose");

let kategorijaSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: {type : String, unique : true}
});

let Kategorija = mongoose.model('Kategorija', kategorijaSchema, 'Kategorija');