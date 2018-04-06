let router = require('express').Router();
let mainHandler = require('../controllers/esController');
let subscriptionHandler = require('../controllers/webpushController');

router.get('/', mainHandler.naslovnaStran);

router.post('/prijava', mainHandler.prijaviUporabnika);

router.get('/prijava', mainHandler.prijava);

router.post('/registracija', mainHandler.ustvariUporabnika);

router.post('/ustvari_nalogo', mainHandler.ustvariNalogo);

router.post('/prikazi_naloge', mainHandler.prikaziNaloge);
/*
router.get('/uredi_cilj', mainHandler.urediCilj);
*/
router.post('/ustvari_cilj', mainHandler.ustvariCilj);

router.get('/koledar/:koledarId', mainHandler.prikaziKoledar);

router.post('/settings', mainHandler.posodobiOsebnePodatke);

router.post('/notifications', mainHandler.posodobiObvestila);

router.post('/invite', mainHandler.povabiUporabnika);

router.get('/odjava', mainHandler.odjava);

router.post('/api/save-subscription', subscriptionHandler.dodajObvestila);

router.post('/api/disable-subscription', subscriptionHandler.odstraniObvestila);

router.post('/api/trigger-push-msg', subscriptionHandler.posljiObvestila);




/*
// BAZA

router.get("/db", krmilnikNavigacija.upravljajZBazo);

router.post("/db/napolni", krmilnikNavigacija.napolniPodatke);

router.post("/db/izbrisi", krmilnikNavigacija.izbrisiPodatke);

router.get("/db/test", krmilnikNavigacija.testirajBazo);

router.post("/db/dodaj", krmilnikNavigacija.dodajPodatek);
*/

module.exports = router;