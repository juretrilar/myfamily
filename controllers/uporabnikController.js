let mongoose = require("mongoose");
let User = mongoose.model("Uporabnik");
let ObjectId = mongoose.Types.ObjectId;

function vrniNapako(res, err){
    res.render("error", {message : "Napaka pri poizvedbi /db", error : {status : 500, stack : err}});
}

module.exports.dodajUporabnika = function(req, res, next){
    let noviUporabnik = {
    };

    Uporabnik.create(noviUporabnik).then(data => {
        res.redirect("/");
    }).catch(err => {
        vrniNapako(res, err);
    });
};

module.exports.izbrisiUporabnika = function(req, res, next){
    let id = req.params.id;
    User.remove({ _id : id}).then( () => {
        res.json({status : 204});
    }).catch(err => {
        vrniNapako(res, err);
    });
};

function generirajDruzinaTag(n = 6){
    let druzinaTag = "";
    while(druzinaTag.length < n){
        let kar = -1;
        do {
            kar = Math.floor(Math.random() * (122 - 48 + 1)) + 48;
        } while( (kar > 57) && (kar < 65 || kar > 90) && (kar < 97 || kar > 122) );
        druzinaTag += String.fromCharCode(kar);
    }
    return druzinaTag;
}