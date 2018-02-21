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

    let personGroup = $('input[name=person]');
    $("#checkboxVsi").on( "click", function() {
        if ($(this).is(':checked')) {
            personGroup.parent().each(function (index, element) {
                element.MaterialCheckbox.check();
            });
        } else {
            personGroup.parent().each(function (index, element) {
                element.MaterialCheckbox.uncheck();
            });
        }
    });
    $(document).on('change', 'input[name=person]', function(e) {
        if($("#checkboxVsi").is(':checked') && $('input[name=person]:checked').length < personGroup.length) {
            $("#checkboxVsi").parent()[0].MaterialCheckbox.uncheck();
        } else if(!$("#checkboxVsi").is(':checked') && $('input[name=person]:checked').length === personGroup.length-1) {
            $("#checkboxVsi").parent()[0].MaterialCheckbox.check();
        }
        //DO YOUR THANG
    });

    /*
    function onCardClick(cardId, callback) {
        let parent = document.getElementById("nalogeGrid"),
            card = parent.getElementsByClassName("mdl-card"),i;
        for (i = 0; i < card.length; i++) {
            card[i].onclick = function (card) {
                return function () {
                    callback(card, event);
                };
            }(card[i]);
        }
    } onCardClick("my-parent-id", function (card, event){
        if ($(event.target).hasClass("mdl-menu__item")) {
            // vstavi spremembo v bazo
            return;
        }
        posodobiNalogo();
        /* Zaenkrat še ne dela
        $('#imeDialog').val("<%= card.ime %>")
            .parent().addClass("is-dirty");
        $('#opisDialog').val("<%= card.opis %>")
            .parent().addClass("is-dirty");
        $('#targetZacetek').val("<%= card.zacetek %>")
            .parent().addClass("is-dirty");
        $('#targetKonec').val("<%= card.konec %>")
            .parent().addClass("is-dirty");
        $('#vezanCilj').val("<%= card.konec %>")
            .parent().addClass("is-dirty");
        $('#kategorija').val("<%= card.konec %>")
            .parent().addClass("is-dirty");

    });*/
    let z = new mdDateTimePicker.default({
        type: 'date',
        init: moment('2016-03-3', 'YYYY-MM-DD'),
        orientation: 'PORTRAIT'
    });
    let elementZ = document.getElementById('dialogZacetek');
    elementZ.addEventListener('click', function() {
        z.toggle();
        $("#mddtp-picker__date").attr('style',"z-index: 100");
    });
    let k = new mdDateTimePicker.default({
        type: 'date',
        init: moment('2016-03-3', 'YYYY-MM-DD'),
        orientation: 'PORTRAIT'
    });
    let elementK = document.getElementById('dialogKonec');
    elementK.addEventListener('click', function() {
        k.toggle();
    });
};

function clearData() {
    $('#imeDialog').val("");
    $('#opisDialog').val("");
    $('#targetZacetek').val("");
    $('#targetKonec').val("");
    //$('#listClani').find("input[type='checkbox']").parent().removeClass('is-checked');
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
    $('#ciljiVsi').attr('style',"display: none!important");
    $('#dialogKategorija').attr('style',"display: block!important");
    $('#claniNaloge').attr('style',"display: block!important");
    $('#dialogCilj').attr('style',"display: block!important");
    $('#update_dialog').attr('action',"/ustvari_nalogo");

}

function fillCilji() {
    $('#iDialog').html("Ime cilja");
    $('#oDialog').html("Opis cilja");
    $('#tZacetek').html("Zacetek cilja");
    $('#tKonec').html("Konec cilja");
    $('#ciljiVsi').attr('style',"display: block!important");
    $('#dialogKategorija').attr('style',"display: none!important");
    $('#claniNaloge').attr('style',"display: none!important");
    $('#dialogCilj').attr('style',"display: none!important");
    $('#update_dialog').attr('action',"/ustvari_cilj");
}

function posodobiCilj() {
    clearData();
    fillCilji();
    document.getElementById("dialog-title").innerHTML = "Uredi cilj";
    document.getElementById("ustvari").innerHTML = "Posodobi";
    dialog.showModal();
    $("#dialog-div").attr('style', 'height: auto');

}

function posodobiNalogo() {
    clearData();
    fillNaloge();
    document.getElementById("dialog-title").innerHTML = "Uredi nalogo";
    document.getElementById("ustvari").innerHTML = "Posodobi";
    dialog.showModal();
    $("#dialog-div").attr('style', 'height: '+$("#dialog").height() + 'px;');
}

function dodajNovCilj() {
    clearData();
    fillCilji();
    document.getElementById("dialog-title").innerHTML = "Dodaj nov cilj";
    document.getElementById("ustvari").innerHTML = "Ustvari";
    dialog.showModal();
    $("#dialog-div").attr('style', 'height: auto');
}

function dodajNovoNalogo() {
    clearData();
    fillNaloge();
    document.getElementById("dialog-title").innerHTML = "Dodaj novo nalogo";
    document.getElementById("ustvari").innerHTML = "Ustvari";
    dialog.showModal();
    $("#dialog-div").attr('style', 'height: '+$("#dialog").height() + 'px;');

}
/*
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
}); */
