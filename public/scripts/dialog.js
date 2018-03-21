let validation = 0;



jQuery(function($) {
    'use strict';
    document.onclick = zapriVse();

    document.onmouseup = (function(e)    {
        let container = $(".tri-card");

        if($(container).is(":visible")) {
            if (!container.is(e.target) && container.has(e.target).length === 0)        {
                container.hide();
            }
        }
    });


    /*Dobim slike in jih zapišem v img, sliko prijavljenega uporabnika dam za ozadje.
    V skripti preštejem slike in jim na podlagi števila naredim izris.

    Če bo potrebno bom dodal večje ikone na večjih ekranih. Potrebno je preveriti kaj se zgodi če imamo preveč uporabnikov.
     */
    document.querySelector('#phoneCall').onclick = function () { document.querySelector('#contactInfo').setAttribute("action", $("#contactInfo").find("input")[0].value)};
    document.querySelector('#smsSend').onclick = function () { document.querySelector('contactInfo').setAttribute("action", $("#contactInfo").find("input")[1].value)};
    document.querySelector('#mailSend').onclick = function () { document.querySelector('contactInfo').setAttribute("action", $("#contactInfo").find("input")[2].value)};
    document.querySelector('#viberOpen').onclick = function () { document.querySelector('contactInfo').setAttribute("action", $("#contactInfo").find("input")[3].value)};

    onUserClick("container", function (img){
        let pos = img.getBoundingClientRect();
        console.log(pos);
        $(".tri-card").attr("style","display: block;").offset({ top: pos.top-145, left: pos.left-90 });
    });

    let dialog = document.querySelector('dialog');
    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector('.close').onclick = function() {
        dialog.close();
    };

    function onRowClick(tableId, callback) {
        let table = document.getElementById(tableId),
            rows = table.getElementsByTagName("TR"),i;
        for (i = 1; i < rows.length; i++) {
            table.rows[i].onclick = function (row) {
                return function () {
                    callback(row);
                };
            }(table.rows[i]);
        }
    }
    onRowClick("table-cilji", function (row){
        posodobiCilj(row);
    });
    onRowClick("table-cilji-end", function (row){
        posodobiCilj(row);
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

function posodobiCilj(row) {
    clearData();
    fillCilji();
    document.getElementById("dialog-title").innerHTML = "Uredi cilj";
    document.getElementById("ustvari").innerHTML = "Posodobi";
    $('#imeDialog').val(row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.children[0].innerHTML)
        .parent().addClass("is-dirty");
    $('#opisDialog').val(row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.children[1].innerHTML)
        .parent().addClass("is-dirty");
    $("#xpNaloge").val(row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.children[2].value)
        .parent().addClass("is-dirty");
    if(row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.children[3].value === "true") $("#skupnaNaloga").parent().get(0).MaterialCheckbox.check();
    $("#newDialog").val(row.getElementsByTagName("td")[0].lastElementChild.lastElementChild.children[4].value);
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
    if(document.forms["update_dialog"]["xpNaloge"].value == "") {
        return false;
    }
    if($('#newDialog').val()) {
        $('#sporocilo').innerText = "Cilj je bil uspešno ustvarjen.";
    } else {
        $('#sporocilo').innerText = "Cilj je bil uspešno posodobljen.";
    }
    if (validation==0) {
        let dZac = document.forms["update_dialog"]["dateZacetek"].value;
        let dKon = document.forms["update_dialog"]["dateKonec"].value;
        if (dZac != "") {
            if (dKon != "" && dZac > dKon) {
                $("#dateKonecErr").text("Datum konca mora biti po datumu začetka!").parent().addClass("is-invalid");
                return false;
            }
        }
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

function zapriVse(evt) {
    $('.hideOnClick').attr('style',"display: none!important");
    console.log("close all");
}

function onUserClick(imgId, callback) {
    let wrap = document.getElementsByClassName(imgId)[0],
        img = wrap.getElementsByClassName("user"),i;
    for (i = 0; i < img.length; i++) {
        img[i].onclick = function (img) {
            return function () {
                callback(img);
            };
        }(img[i]);
    }
}