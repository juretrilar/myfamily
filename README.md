# myfamily

MyFamily app prototype
Interactive prototype designed for EkoSmart RRP3 project.

## Namestitev in zagon

git clone https://github.com/juretrilar/myfamily.git

cd myfamily

npm install

npm start

## Strani

Strani do katerih lahko uporabnik dostopa in na njih izvaja različne ukaze. Vse strani so dostone iz navigacijske vrstice z enim klikom

### Prijava

Prijavna stran. Na strani se najprej izriše okno za vpis, v primeru, da uporabnik še ni registriran pa lahko z klikom na registracijo odpre okno za registracijo. Z klikom na gumb registracija se uporabnik registrira in se mu odpre okno za prijavo.

TODO: Generiranje ključev za družino in preverjanje le teh.


### Dashboard

Osnovna stran, na njej lahko uporabnik vidi opomnike na dogodke za celotno družino. Prikazani so tudi vsi uporabniki, ki so del družine. Družinski člani lahko spremljajo fizično aktivnost družine in objavijo status, ki je viden vsem članom.
Na dnu strani lahko uporabnik vidi skupne cilje družine in doda nov cilj.

TODO: Graf fizične aktivnosti, izris družinskih članov.


### Koledar

Uporabik lahko na teji strani dostopa do koledarja, kjer ima označene datume za cilje in naloge, ki jih morajo izpolniti člani družine. 
Ob kliku na posamezen dan se uporabniku odprejo vsi dogodki na tisti dan. Ob kliku na posamezeno nalogo pa lahko pogleda podrobnosti naloge.


### Naloge

Uporabnik lahko na teji strani išče po svojih nalogah, na voljo ima filtre po katerih lahko poišče nalogo z želenim parametrom. Pod iskalnim filtrom se mu nato izpišejo vse naloge, ki ustrezajo izbranim parametrom. Uporabnik lahko uporabi poljubno število parametrov za iskanje. Če išče brez nastavljenih parametrov se mu prikažejo vse naloge.

Uporabnik z klikom na gumb opre okno kjer lahko doda novo nalogo. Z klikom na točno določeno nalogo se mu ta naloga odpre in jo lahko spreminja.


### Cilji

Uporabnik lahko na teji strani dostopa do vseh skupnih ciljev, ki jih ima družina. 

Uporabnik lahko z klikom na gumb odpre okno za dodajanje novih ciljev. Z klikom na že obstoječ cilj pa se mu odpre okno in lahko spreminja izbran cilj.
