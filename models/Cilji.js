let mongoose = require("mongoose");

let ciljiSchema = new mongoose.Schema({
    _id : {type : mongoose.Schema.Types.ObjectId, required : true},
    ime: { type:String, required: true, unique: true},
    opis: { type:String, required: true},
    zacetek: { type:Date, default: Date.now },
    last_updated: {type:Date, default: Date.now},
    konec: { type:Date },
    xp: Number,
    maxXp: Number,
    vezane_naloge: [{_id : false, id_nal : mongoose.Schema.Types.ObjectId, stanje: Boolean }],
    vezani_uporabniki: [{_id : false, id_user : mongoose.Schema.Types.ObjectId , xp_user : Number }],
    skupni_cilj: Boolean,
},  { usePushEach: true });

mongoose.model('Cilji', ciljiSchema, 'Cilji');

