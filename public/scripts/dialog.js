window.onload = function() {
    'use strict';
    let dialog = document.querySelector('dialog');
    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    function onRowClick(tableId, callback) {
        let table = document.getElementById("table-cilji"),
            rows = table.getElementsByTagName("TR"),i;
        for (i = 0; i < rows.length; i++) {
            table.rows[i].onclick = function (row) {
                return function () {
                    callback(row);
                };
            }(table.rows[i]);
        }
    } onRowClick("my-table-id", function (row){
        posodobiCilj();
        $('#imeDialog').val(row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.firstElementChild.innerHTML)
            .parent().addClass("is-dirty");
        $('#opisDialog').val(row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.lastElementChild.innerHTML)
            .parent().addClass("is-dirty");
        $('#targetZacetek').val(row.getElementsByTagName("td")[1].innerHTML)
            .parent().addClass("is-dirty");
        $('#targetKonec').val(row.getElementsByTagName("td")[2].innerHTML)
            .parent().addClass("is-dirty");

        //xp row.getElementsByTagName("td")[3].innerHTML
        //opravljeno row.getElementsByTagName("td")[4].innerHTML
    });
    dialog.querySelector('button:not([disabled])')
        .addEventListener('click', function() {
            dialog.close();
        });
    /*
    $('.checkbox-modal input:checkbox,.label-modal').on('click', function(e) {
        console.log("checkbox");
        e.stopImmediatePropagation();
        var element = (e.currentTarget.htmlFor !== undefined) ? e.currentTarget.htmlFor : e.currentTarget;
        var checked = (element.checked) ? false : true;
        element.checked = (checked) ? false : checked.toString();
    }); */
    //for (let i=0; i < numNaloge;i++) {}
};

function clearData() {
    $('#imeDialog').val("");
    $('#opisDialog').val("");
    $('#targetZacetek').val("");
    $('#targetKonec').val("");
    $('#listClani').find("input[type='checkbox']").parent().removeClass('is-checked');
    $('#targetKonec').parent().removeClass("is-dirty");
    $('#targetZacetek').parent().removeClass("is-dirty");
    $('#opisDialog').parent().removeClass("is-dirty");
    $('#imeDialog').parent().removeClass("is-dirty");
}

function fillNaloge() {
    $('#iDialog').html("Ime naloge");
    $('#oDialog').html("Opis naloge");
    $('#tZacetek').html("Začetek naloge");
    $('#tKonec').html("Konec naloge");
    $('#dialogKategorija').attr('style',"display: block!important");
    $('#claniNaloge').attr('style',"display: block!important");
    $('#dialogCilj').attr('style',"display: block!important");
}

function fillCilji() {
    $('#iDialog').html("Ime cilja");
    $('#oDialog').html("Opis cilja");
    $('#tZacetek').html("Začetek cilja");
    $('#tKonec').html("Konec cilja");
    $('#dialogKategorija').attr('style',"display: none!important");
    $('#claniNaloge').attr('style',"display: none!important");
    $('#dialogCilj').attr('style',"display: none!important");
}

function posodobiCilj() {
    clearData();
    fillCilji();
    document.getElementById("dialog-title").innerHTML = "Uredi cilj";
    document.getElementById("ustvari").innerHTML = "Posodobi";
    dialog.showModal();
}

function posodobiNalogo() {
    clearData();
    fillNaloge();
    document.getElementById("dialog-title").innerHTML = "Uredi nalogo";
    document.getElementById("ustvari").innerHTML = "Posodobi";
    dialog.showModal();
}

function dodajNovCilj() {
    clearData();
    fillCilji();
    document.getElementById("dialog-title").innerHTML = "Dodaj nov cilj";
    document.getElementById("ustvari").innerHTML = "Ustvari";
    dialog.showModal();
}

function dodajNovoNalogo() {
    clearData();
    fillNaloge();
    document.getElementById("dialog-title").innerHTML = "Dodaj novo nalogo";
    document.getElementById("ustvari").innerHTML = "Ustvari";
    dialog.showModal();
}

$('#zacetekDialog').monthly({
    mode: 'picker',
    target: '#targetZacetek',
    startHidden: true,
    showTrigger: '#targetZacetek',
    stylePast: true,
    disablePast: false
});

$('#konecDialog').monthly({
    mode: 'picker',
    target: '#targetKonec', // The element that will have its value set to the date you picked
    startHidden: true, // Set to true if you want monthly to appear on click
    showTrigger: '#targetKonec', // Element that you click to make it appear
    stylePast: true, // Add a style to days in the past
    disablePast: false // Disable clicking days in the past
});