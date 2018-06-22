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

router.post('/status', mainHandler.shraniStatus);

router.post('/delete-cilj', mainHandler.izbrisiCilj);

router.post('/delete-naloga', mainHandler.izbrisiNalogo);

router.get('/change/:druzinaId', mainHandler.spremeniDruzino);

router.post('/api/save-subscription', subscriptionHandler.dodajObvestila);

router.post('/api/disable-subscription', subscriptionHandler.odstraniObvestila);

router.post('/api/prijava', subscriptionHandler.posljiToken);

router.post('/api/koraki', subscriptionHandler.prejmiKorake);

router.post('/api/naloga/idNaloge', subscriptionHandler.prejmiNalogo);

router.get('/api/naloge/', subscriptionHandler.posljiNaloge);

router.get('/api/cilji/', subscriptionHandler.posljiCilje);

router.get('/api/kategorije/', subscriptionHandler.posljiKategorije);



//router.post('/api/trigger-push-msg', subscriptionHandler.posljiObvestila);


module.exports = router;