let router = require('express').Router();
let requestHandler = require('../controllers/esController');

router.get('/', requestHandler.naslovnaStran);

router.post('/prijava', requestHandler.prijaviUporabnika);
/*
router.get('/odjava', requestHandler.odjaviUporabnika);
*/

router.post('/registracija', requestHandler.ustvariUporabnika);
/*
router.get('/naloge', requestHandler.Naloge);
*/
router.post('/ustvari_nalogo', requestHandler.ustvariNalogo);

/*
router.get('/uredi_cilj', requestHandler.urediCilj);
*/
router.post('/ustvari_cilj', requestHandler.ustvariCilj);
/*
router.get('/koledar', requestHandler.napolniKoledar);
*/
router.get('/odjava', requestHandler.odjava);
/*
// BAZA

router.get("/db", krmilnikNavigacija.upravljajZBazo);

router.post("/db/napolni", krmilnikNavigacija.napolniPodatke);

router.post("/db/izbrisi", krmilnikNavigacija.izbrisiPodatke);

router.get("/db/test", krmilnikNavigacija.testirajBazo);

router.post("/db/dodaj", krmilnikNavigacija.dodajPodatek);
*/

module.exports = router;