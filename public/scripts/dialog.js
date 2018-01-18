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
        posodobiCilj();
        $('#imeCilja').val(row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.firstElementChild.innerHTML);
        $('#imeCilja').parent().addClass("is-dirty");
        $('#opisCilja').val(row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.lastElementChild.innerHTML);
        $('#opisCilja').parent().addClass("is-dirty");
        $('#targetZacetek').val(row.getElementsByTagName("td")[1].innerHTML);
        $('#targetZacetek').parent().addClass("is-dirty");
        $('#targetKonec').val(row.getElementsByTagName("td")[2].innerHTML);
        $('#targetKonec').parent().addClass("is-dirty");

        //xp row.getElementsByTagName("td")[3].innerHTML
        //opravljeno row.getElementsByTagName("td")[4].innerHTML
    });
    dialog.querySelector('button:not([disabled])')
        .addEventListener('click', function() {
            dialog.close();
        });
    $("#targetZacetek").click(function() {
        $('#ciljZacetek').addClass("is-dirty");
    });
    $("#targetKonec").click(function() {
        $('#ciljKonec').addClass("is-dirty");
    });
}();

function clearData() {
    $('#imeCilja').val("");
    $('#opisCilja').val("");
    $('#targetZacetek').val("");
    $('#targetKonec').val("");
}

function posodobiCilj() {
    dialog.showModal();
    clearData();
    document.getElementById("cilj-title").innerHTML = "Uredi cilj";
    document.getElementById("ustvariCilj").innerHTML = "Posodobi";
    console.log("posodabljam");
}

function dodajNovCilj() {
    dialog.showModal();
    clearData();
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
