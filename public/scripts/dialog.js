let validation = 0;

const applicationServerPublicKey = 'BGa5M248kds3Uw6AkR6igb3aq4OQw1zFmSBNuFj10kwdsqZ8DXoYtvLUPCMsUIpMKQiPzdOY-s-3mkVnPhRUiQg';
let isSubscribed = false;
let swRegistration = null;

let colors = ["#00FF00", "#6699ff", "#ff6600", "#FF25FF", "#FF6C6A", "#53ff1a", "#00C8FF", "#ff66ff","#ff9900"];

jQuery(function($) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');

        navigator.serviceWorker.register('sw.js')
            .then(function(swReg) {
                console.log('Service Worker is registered', swReg);

                swRegistration = swReg;
                initializeUI();
            })
            .catch(function(error) {
                console.error('Service Worker Error', error);
            });
    } else {
        console.warn('Push messaging is not supported');
        pushButton.textContent = 'Push Not Supported';
    }

    document.onclick = zapriVse();

    document.onmouseup = (function(e)    {
        let container = $(".tri-card");

        if($(container).is(":visible")) {
            if (!container.is(e.target) && container.has(e.target).length === 0)        {
                container.hide();
            }
        }
    });

    tockeUdelezencev($('#table-cilji').find('tr').length-1, "progress", "razmerje");
    tockeUdelezencev($('#table-cilji-end').find('tr').length-1, "progressE", "razmerjeE");

    // TODO
    /*Dobim slike in jih zapišem v img, sliko prijavljenega uporabnika dam za ozadje.
    V skripti preštejem slike in jim na podlagi števila naredim izris.

    Če bo potrebno bom dodal večje ikone na večjih ekranih. Potrebno je preveriti kaj se zgodi če imamo preveč uporabnikov.
     */

    onUserClick("container", function (img){
        let pos = img.getBoundingClientRect();
        $(".tri-card").attr("style","display: block;").offset({ top: pos.top-145, left: pos.left-90 });
        $("#userCard").text(img.nextElementSibling.value);
        $("#phoneCall").attr("href","tel:"+img.nextElementSibling.nextElementSibling.value);
        $("#smsSend").attr("href","sms:"+img.nextElementSibling.nextElementSibling.value);
        $("#mailSend").attr("href","mailto:"+img.nextElementSibling.nextElementSibling.nextElementSibling.value);
        $("#viberOpen").attr("href","viber://chats?number="+img.nextElementSibling.nextElementSibling.value);
    });

    $('#mycalendar').monthly({
        mode: 'event',
        dataType: 'json',
        jsonUrl: id+"/data/events.json"
    });
    switch(window.location.protocol) {
        case 'http:':
        case 'https:':
            // running on a server, should be good.
            break;
        case 'file:':
            alert('Just a heads-up, events will not work when run locally.');
    }

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

function cleanNav() {
    $("#dashboard").removeClass("is-active");
    $("#cilj").removeClass("is-active");
    $("#naloge").removeClass("is-active");
    $("#koledar").removeClass("is-active");
    $("#menuDashboard").removeClass("is-active");
    $("#menuCilj").removeClass("is-active");
    $("#menuNaloge").removeClass("is-active");
    $("#menuKoledar").removeClass("is-active");
}

function openSettings() {
    cleanNav();
    $("#notifications").removeClass("is-active");
    $("#settings").addClass("is-active");
}

function openNotifications() {
    cleanNav();
    $("#settings").removeClass("is-active");
    $("#notifications").addClass("is-active");
}

//SERVER WORKER
function initializeUI() {
    pushButton.addEventListener('click', function() {
        pushButton.disabled = true;
        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);

            //updateSubscriptionOnServer(subscription);

            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

            updateBtn();
        });
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function(subscription) {
            updateSubscriptionOnServer(subscription);

            console.log('User is subscribed.');

            isSubscribed = true;

            updateBtn();
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
}

function updateSubscriptionOnServer(subscription) {
    return fetch('/api/save-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(subscription)
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Bad status code from server.');
         
        }    
        return response.json();
      })
      .then(function(responseData) {
        if (!(responseData.data && responseData.data.success)) {
          throw new Error('Bad response from server.');
        }
      });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch(function(error) {
            console.log('Error unsubscribing', error);
        })
        .then(function() {
            updateSubscriptionOnServer(null);

            console.log('User is unsubscribed.');
            isSubscribed = false;

            updateBtn();
        });
}

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Obvestila so blokirana';
        pushButton.disabled = true;
        updateSubscriptionOnServer(null);
        return;
      }
    
    if (isSubscribed) {
        $("#pushButton").text('Izklopi obvestila v brskalniku');
    } else {
        $("#pushButton").text('Vklopi obvestila v brskalniku');
    }
    $("#pushButton").removeAttr("disabled");
}

function tockeUdelezencev(stCiljev, prg, razmerje) {
    for(let i = 0; i <stCiljev; i++) {
        let curr = $('.'+prg+i).children();
        let stUporabnikov = curr.length;
        let sumXP = 0;
        curr.each(function() {
            sumXP += parseInt($(this)[0].innerHTML);
        });
        //curr.text(sumXP+"/"+$("."+prg+i).prev().find("input[name=person]").val());
        $("#"+razmerje+i).text(sumXP+"/"+$("."+prg+i).parent().prev().prev().find("input[name=maxXp]").val());
        console.log($("."+prg+i).parent().prev().prev().find("input[name=maxXp]"));
        if(stUporabnikov==0) {
            $("."+prg+i).attr('style',"display: none!important");
        } else if (stUporabnikov == 1) {
            $("."+prg+i+" :nth-child(1)").addClass("spanOnly");
        } else {
            $("."+prg+i+" :nth-child(1)").attr('style',"width: "+(curr[0].innerHTML/sumXP)*100+"%; background-color: #FF8C1A").addClass("spanFirst");
            for (let j=2; j<stUporabnikov; j++) {
                let span = $("."+prg+i+" :nth-child("+j+")");
                span.attr('style',"width: "+(curr[j-1].innerHTML/sumXP)*100+"%; background-color: "+colors[j-2]+";");
            }
            $("."+prg+i+" :nth-child("+stUporabnikov+")").attr('style',"width: "+(curr[stUporabnikov-1].innerHTML/sumXP)*100+"%; background-color: yellow;").addClass("spanLast");
        }
    }
}

function zapriNalogo() {
    $("#NalogaPopUp").css("display", "none");
}