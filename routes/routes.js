let router = require('express').Router();
let requestHandler = require('../controllers/esController');

router.get('/', requestHandler.naslovnaStran);

//outer.get('/prijava', requestHandler.prijavaStran);

router.post('/prijava', requestHandler.prijaviUporabnika);
/*
router.get('/odjava', requestHandler.odjaviUporabnika);

router.get('/registracija', requestHandler.registracijaStran);
*/
router.post('/registracija', requestHandler.ustvariUporabnika);
/*
router.get('/uredi_nalogo', requestHandler.urediNalogo);

router.post('/ustvari_nalogo', requestHandler.ustvariNalogo);

router.get('/uredi_cilj', requestHandler.urediCilj);

router.post('/ustvari_cilj', requestHandler.ustvariCilj);

router.get('/koledar', requestHandler.napolniKoledar);

// BAZA

router.get("/db", krmilnikNavigacija.upravljajZBazo);

router.post("/db/napolni", krmilnikNavigacija.napolniPodatke);

router.post("/db/izbrisi", krmilnikNavigacija.izbrisiPodatke);

router.get("/db/test", krmilnikNavigacija.testirajBazo);

router.post("/db/dodaj", krmilnikNavigacija.dodajPodatek);
*/

module.exports = router;