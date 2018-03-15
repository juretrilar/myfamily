let validation = 0;
jQuery(function($) {
    'use strict';
    document.onclick = zapriVse;

    let dialog = document.querySelector('dialog');
    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').onclick = function() {
        dialog.close();
    };

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
        $('#targetZacetek').val(row.getElementsByTagName("td")[2].innerHTML)
            .parent().addClass("is-dirty");
        $('#targetKonec').val(row.getElementsByTagName("td")[3].innerHTML)
            .parent().addClass("is-dirty");

        //xp row.getElementsByTagName("td")[3].innerHTML
        //opravljeno row.getElementsByTagName("td")[4].innerHTML
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
    let dz = new mdDateTimePicker.default({
        type: 'date',
        past: moment().subtract(1, 'years'),
        future: moment().add(1, 'years'),
    });
    let tz = new mdDateTimePicker.default({
        type: 'time',
    });
    registerDateTimePicker("dialogZacetek", dz, "targetZacetek", "dateZacetek", tz);
    let dk = new mdDateTimePicker.default({
        type: 'date',
        past: moment().subtract(1, 'years'),
        future: moment().add(1, 'years'),
    });
    let tk = new mdDateTimePicker.default({
        type: 'time',
    });
    registerDateTimePicker("dialogKonec", dk, "targetKonec", "dateKonec", tk);
    dialog.appendChild(document.getElementById("mddtp-picker__time"));
    dialog.appendChild(document.getElementById("mddtp-picker__date"));


});

function clearData() {
    $('#newDialog').val("");
    $('#imeDialog').val("").parent().removeClass("is-dirty");
    $('#opisDialog').val("").parent().removeClass("is-dirty");
    $('#targetZacetek').val("").parent().removeClass("is-dirty");
    $('#targetKonec').val("").parent().removeClass("is-dirty");
    $('#oldStatus').val("");
    $('#newStatus').val("");
    //$('#listClani').find("input[type='checkbox']").parent().removeClass('is-checked');
}

function fillNaloge() {
    $('#iDialog').html("Ime naloge");
    $('#oDialog').html("Opis naloge");
    $('#tZacetek').html("Začetek naloge");
    $('#tKonec').html("Konec naloge");
    $('#ciljiVsi').attr('style',"display: none!important");
    $('#dialogKategorija').attr('style',"display: block!important");
    $('#dialogZacetek').attr('style',"display: block!important");
    $('#dialogKonec').attr('style',"display: block!important");
    $('#claniNaloge').attr('style',"display: block!important");
    $('#dialogCilj').attr('style',"display: block!important");
    $('#dialogStatus').attr('style',"display: block!important");
    $('#update_dialog').attr('action',"/ustvari_nalogo").attr('onsubmit',"return validateNaloga()");
}

function fillCilji() {
    $('#iDialog').html("Ime cilja");
    $('#oDialog').html("Opis cilja");
    $('#tZacetek').html("Zacetek cilja");
    $('#tKonec').html("Konec cilja");
    $('#ciljiVsi').attr('style',"display: block!important");
    $('#dialogKategorija').attr('style',"display: none!important");
    $('#dialogZacetek').attr('style',"display: none!important");
    $('#dialogKonec').attr('style',"display: none!important");
    $('#claniNaloge').attr('style',"display: none!important");
    $('#dialogCilj').attr('style',"display: none!important");
    $('#dialogStatus').attr('style',"display: none!important");
    $('#update_dialog').attr('action',"/ustvari_cilj").attr('onsubmit'," return validateCilj()");
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
    $('#newDialog').val("");
    dialog.showModal();
    $("#dialog-div").attr('style', 'height: auto');
}

function dodajNovoNalogo() {
    clearData();
    fillNaloge();
    document.getElementById("dialog-title").innerHTML = "Dodaj novo nalogo";
    document.getElementById("ustvari").innerHTML = "Ustvari";
    $('#newDialog').val("");
    dialog.showModal();
    $("#dialog-div").attr('style', 'height: '+$("#dialog").height() + 'px;');
}

function validateCilj() {
    validation = 1;
    validateNaloga();
}

function validateNaloga() {
    if (document.forms["update_dialog"]["imeDialog"].value == "") {
        $("#imeDialogErr").text("Polje je obvezno!").parent().addClass("is-invalid");
        return false;
    }
    if (document.forms["update_dialog"]["opisDialog"].value == "") {
        $("#opisDialogErr").text("Polje je obvezno!").parent().addClass("is-invalid");
        return false;
    }
    let dZac = document.forms["update_dialog"]["dateZacetek"].value;
    let dKon = document.forms["update_dialog"]["dateKonec"].value;
    if (dZac != "") {
        if (dKon != "" && dZac > dKon) {
            $("#dateKonecErr").text("Datum konca mora biti po datumu začetka!").parent().addClass("is-invalid");
            return false;
        }
    }
    if($('#newDialog').val()) {
        $('#sporocilo').innerText = "Cilj je bil uspešno ustvarjen.";
    } else {
        $('#sporocilo').innerText = "Cilj je bil uspešno posodobljen.";
    }
    if (validation==0) {
        if (document.forms["update_dialog"]["vezanCilj"].value == "") {
            alert("Vezan cilj mora biti izbran.");
            return false;
        }
        if (document.forms["update_dialog"]["sampleKategorija"].value == "") {
            alert("Kategorija mora biti izbrana.");
            return false;
        }
        if (document.forms["update_dialog"]["statusNaloge"].value == "") {
            alert("Status naloge mora biti izbran.");
            return false;
        }
        if($('#newDialog').val()) {
            $('#sporocilo').innerText = "Naloga je bila uspešno ustvarjena.";
        } else {
            $('#sporocilo').innerText = "Naloga je bila uspešno posodobljena.";
        }
        console.log("cilj");
    }
    validation = 0;
}

function registerDateTimePicker(elementId, picker, inputId, inputDateId, pickerTime) {
    let element = document.getElementById(elementId);
    element.addEventListener('click', function(e) {
        picker.trigger = element;
        picker.toggle();
    });
    element.addEventListener('onOk', function(e) {
        openTimePicker(elementId,picker, inputId,inputDateId, pickerTime);
    });
}

function openTimePicker(elementId,picker, inputId, inputDateId, pickerTime) {
    let element = document.getElementById(elementId);
    let input = document.getElementById(inputId);
    let hidden = document.getElementById(inputDateId);
    pickerTime.trigger = element;
    pickerTime.toggle();
    element.addEventListener('onOk', function(e) {
        hidden.value = picker.time.format('Y-MM-DD') + " " + pickerTime.time.format('HH:mm Z');
        input.value = picker.time.format('DD-MM-Y') + " ob " + pickerTime.time.format('HH:mm');
        input.parentNode.MaterialTextfield.checkDirty();
    });
    element.addEventListener('onCancel', function(e) {
        hidden.value = picker.time.format('Y-MM-DD')+ " " + new Date().toLocaleTimeString('sl-SI', {hour: "numeric", minute: "numeric", timeZoneName: "short"});
        input.value = picker.time.format('DD-MM-Y');
        input.parentNode.MaterialTextfield.checkDirty();
    });
}

function zapriVse() {
    $('.hideOnClick').attr('style',"display: none!important");
}