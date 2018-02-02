let mongoose = require("mongoose");

let kategorijaSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    kategorija: {type : String}
});

let Kategroija = mongoose.model('Kategroija', kategorijaSchema, 'Kategorija');