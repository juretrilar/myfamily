let mongoose = require("mongoose");

let druzinaSchema = new mongoose.Schema({
    _id: {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: {type:String, required: true},
    pra_starsi: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    stari_starsi: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    starsi: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    otroci: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    vnuki: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    pravnuki: [{type : mongoose.Schema.Types.ObjectId, ref : "Uporabnik"}],
    cilji: [{type : mongoose.Schema.Types.ObjectId, ref : "Cilji"}]
});

mongoose.model('Druzina', druzinaSchema, 'Druzina');


