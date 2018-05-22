# myfamily

MyFamily app prototype
Interactive prototype designed for EkoSmart RRP3 project.

## Namestitev in zagon

git clone https://github.com/juretrilar/myfamily.git

cd myfamily

npm install

npm start


## Pomembne informacije

Uporabnik za registracijo na strani potrebuje unikatni mail. Ko se registrira, je uporabniku dodeljen družinski ključ(trenutno je lahko en uporabnik v največ 1 družini). Če hoče v svojo družino povabiti še druge družinske člane, se morajo ti najprej registrirati, nato pa klikniti na avtorizacijski link, ki jim ga pošlje eden izmed članov družine. Za boljše delovanje aplikacije je dobro, če ima uporabnik tudi telefon, saj lahko prek senzorjev aplikacija beleži njegovo fizično aktivnost.


## Strani

Strani do katerih lahko uporabnik dostopa in na njih izvaja različne ukaze. Vse strani so dostone iz navigacijske vrstice z enim klikom

### Prijava

Prijavna stran. Na strani se najprej izriše okno za vpis, v primeru, da uporabnik še ni registriran pa lahko z klikom na registracijo odpre okno za registracijo. Z klikom na gumb registracija se uporabnik registrira in se mu odpre okno za prijavo.

### Pregled

Osnovna stran, na njej lahko uporabnik vidi opomnike na dogodke za celotno družino. Prikazani so tudi vsi uporabniki, ki so del družine. Družinski člani lahko spremljajo fizično aktivnost družine in objavijo status, ki je viden vsem članom.
Na dnu strani lahko uporabnik vidi skupne cilje družine in doda nov cilj. Zraven pa se mu izpisujejo predloge za nove naloge.


### Koledar

Uporabik lahko na teji strani dostopa do koledarja, kjer ima označene datume naloge, ki jih morajo izpolniti člani družine. 
Ob kliku na posamezen dan se uporabniku odprejo vsi dogodki na tisti dan. Ob kliku na posamezeno nalogo pa lahko pogleda podrobnosti naloge.


### Naloge

Uporabnik lahko na teji strani išče po svojih nalogah, na voljo ima filtre po katerih lahko poišče nalogo z želenim parametrom. Pod iskalnim filtrom se mu nato izpišejo vse naloge, ki ustrezajo izbranim parametrom. Uporabnik lahko uporabi poljubno število parametrov za iskanje. Če išče brez nastavljenih parametrov se mu prikažejo vse naloge.

Uporabnik z klikom na gumb opre okno kjer lahko doda novo nalogo. Z klikom na točno določeno nalogo se mu ta naloga odpre in jo lahko spreminja. Ko je z spremembami zadovoljen lahko z klikom na gumb nalogo shrani v bazo.

TODO: 
- prikaz nalog se posodablja med izbiranjem

### Cilji

Uporabnik lahko na teji strani dostopa do vseh skupnih ciljev, ki jih ima družina. 

Uporabnik lahko z klikom na gumb odpre okno za dodajanje novih ciljev. Z klikom na že obstoječ cilj pa se mu odpre okno in lahko spreminja izbran cilj.


## Strani dostopne preko menija

### Osebna nastavitve

Uporabnik lahko na tej strani dostopa do vseh svojih osebnih podatkov, ki jih je vnesel že ob registraciji. Doda lahko še svoj položaj v družini.


### Nastavitve sporočanje

Uporabnik lahko na tej strani vklopi ali izklopi različne načine opozoril. Na voljo ima opozorila v brskalniku, sms opozorila in opozorila preko epošte.

TODO splošno:
- pomoč kot overlay na vseh straneh
- znak da so stvari clickable(highlight)
- link za prijavo k družini naj ponudi prijavo če uporabnik ni prijavljen
- klik na myfamily naj pelje nazaj na pregled
- boljše dodajanje časa, alternativna izbira
