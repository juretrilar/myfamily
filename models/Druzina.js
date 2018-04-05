let mongoose = require("mongoose");

let druzinaSchema = new mongoose.Schema({
    _id: {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: {type:String, required: true},
    praS: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    stariS: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    stars: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    otrok: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    vnuk: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    pravnuk: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
});

mongoose.model('Druzina', druzinaSchema, 'Druzina');