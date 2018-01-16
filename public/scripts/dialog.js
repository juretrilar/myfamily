window.onload=function(){
    'use strict';
    let dialog = document.querySelector('dialog');
    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }

    function onRowClick(tableId, callback) {
        let table = document.getElementById("table-cilji"),
            rows = table.getElementsByTagName("TR"),
            i;
        for (i = 0; i < rows.length; i++) {
            table.rows[i].onclick = function (row) {
                return function () {
                    callback(row);
                };
            }(table.rows[i]);
        }
    } onRowClick("my-table-id", function (row){
        console.log(row.getElementsByTagName("td")[3].lastElementChild.lastElementChild.innerHTML);
        // naslov row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.firstElementChild.innerHTML;
        //opis row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.lastElementChild.innerHTML;
        // zacetek row.getElementsByTagName("td")[1].innerHTML
        // konec row.getElementsByTagName("td")[2].innerHTML
        //xp row.getElementsByTagName("td")[3].innerHTML
        //opravljeno row.getElementsByTagName("td")[4].innerHTML
    });
    dialog.querySelector('button:not([disabled])')
        .addEventListener('click', function() {
            dialog.close();
        });
    document.getElementById("targetZacetek").addEventListener('click', function() {
        $('ciljZacetek').addClass("is-dirty");
    });
    document.getElementById("targetKonec").addEventListener('click', function() {
        $('ciljKonec').addClass("is-dirty");
    });
}();

function posodobiCilj() {
    dialog.showModal();
    document.getElementById("cilj-title").innerHTML = "Uredi cilj";
    document.getElementById("ustvariCilj").innerHTML = "Posodobi";
}

function dodajNovCilj() {
    dialog.showModal();
    document.getElementById("cilj-title").innerHTML = "Dodaj nov cilj";
    document.getElementById("ustvariCilj").innerHTML = "Ustvari";
}

$('#zacetek').monthly({
    mode: 'picker',
    target: '#targetZacetek',
    startHidden: true,
    showTrigger: '#targetZacetek',
    stylePast: true,
    disablePast: false
});

$('#konec').monthly({
    mode: 'picker',
    target: '#targetKonec', // The element that will have its value set to the date you picked
    startHidden: true, // Set to true if you want monthly to appear on click
    showTrigger: '#targetKonec', // Element that you click to make it appear
    stylePast: true, // Add a style to days in the past
    disablePast: false // Disable clicking days in the past
});
