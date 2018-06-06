const applicationServerPublicKey = 'BGa5M248kds3Uw6AkR6igb3aq4OQw1zFmSBNuFj10kwdsqZ8DXoYtvLUPCMsUIpMKQiPzdOY-s-3mkVnPhRUiQg';
let isSubscribed = false;
let swRegistration = null;

let pageWidth = $(document).width();
let pageHeight = $(document).height();

let currentElement;

let intro = introJs();

let move = 0;
let shown = 0;

let colors = ["#FEC3BF","#FFDDB9","#A5D8F3","#97EBED","#FEC3BF","#FFDDB9","#A5D8F3","#FEC3BF","#FFDDB9","#A5D8F3"];

$.fn.datepicker.language['sl'] = {
    days: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
    daysShort: ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'],
    daysMin: ['Ne', 'Po', 'To', 'Sr', 'Če', 'Pe', 'So'],
    months: ['Januar','Februar','Marec','April','Maj','Junij', 'Julij','Avgust','September','Oktober','November','December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'],
    today: 'Danes',
    clear: 'Ponastavi',
    dateFormat: 'dd. mm. yyyy',
    timeFormat: 'hh:ii',
    firstDay: 0
};


r(function(){
    if(localStorage.getItem("Status")) {
        let snackbarContainer = document.querySelector('#mainToast');            
        snackbarContainer.MaterialSnackbar.showSnackbar({message: localStorage.getItem("Status")});
        localStorage.clear();
    }

});
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}

jQuery(function($) {
    if(localStorage.getItem("Stran")) {
        let page = localStorage.getItem("Stran");
        switch(page) {
            case 0:
            $("#menuDashboard").addClass("is-active");
            $("#dashboard").addClass("is-active");    
        break;
            case 1:
            $("#menuKoledar").addClass("is-active");
            $("#koledar").addClass("is-active");   
        break;
            case 2:
            $("#menuNaloge").addClass("is-active");
            $("#naloge").addClass("is-active");   
        break;
            case 3:
            $("#menuCilj").addClass("is-active");
            $("#cilj").addClass("is-active");   
        break;
            case 4:
            $("#menuSettings").addClass("is-active");
            $("#settings").addClass("is-active");   
        break;
            case 5:
            $("#menuNotifications").addClass("is-active");
            $("#notifications").addClass("is-active");   
        break;
            case 6:
            $("#menuDruzina").addClass("is-active");
            $("#druzina").addClass("is-active");   
        break;
        default:
            $("#menuDashboard").addClass("is-active");
            $("#dashboard").addClass("is-active");        
        }
        localStorage.removeItem("Stran");
    }
    setTimeout(function(){ 
        alert("Vaša seja je potekla, za nadaljevanje se morate ponovno prijaviti!");  
        window.open('https://ekosmartweb.herokuapp.com/','_blank');  
    }, 3600000);
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
        let container = $(".card-info");

        if($(container).is(":visible")) {
            if (!container.is(e.target) && container.has(e.target).length === 0)        {
                container.hide();
            }
        }
    });

    tockeUdelezencev($('#table-cilji').find('tr').length-1, "progZ", "razmZ");
    tockeUdelezencev($('#table-cilji-end').find('tr').length-1, "progK", "razmK");
    tockeUdelezencev($('#table-skupni').find('tr').length-1, "progS", "razmS");

    onUserClick("container", function (img){      
        let pos = img.getBoundingClientRect();
        let card = $(".card-info");        
        $("#userCard").text(img.nextElementSibling.value);
        $("#phoneCall").attr("href","tel:"+img.nextElementSibling.nextElementSibling.value);
        $("#smsSend").attr("href","sms:"+img.nextElementSibling.nextElementSibling.value);
        $("#mailSend").attr("href","mailto:"+img.nextElementSibling.nextElementSibling.nextElementSibling.value);
        $("#viberOpen").attr("href","viber://chats?number="+img.nextElementSibling.nextElementSibling.value);
        let val = img.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value;
        if(!val) val = 0;
        $("#dayXp").text("+ "+val+" točk");
        
        if(img.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling) {
            $("#status").html(img.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.children[0].innerHTML);
            $(".tri-card-no-status").removeClass("tri-card-no-status").addClass("tri-card-status");
        } else {   
            $("#status").html("");   
            $(".tri-card-status").addClass("tri-card-no-status").removeClass("tri-card-status");
        }
        if (pageWidth > 600) {
            $(".card-info").css({"top": distanceX(img) - parseFloat(card.css("height")),  "left": pos.left-93, "display": "block"});
        } else {
            $(".card-info").css({"top": distanceX(img) - parseFloat(card.css("height")) ,  "left": pos.left-50, "display": "block"});
        }
        
    });

    $('#mycalendar').monthly({
        mode: 'event',
        dataType: 'json',
        jsonUrl: '/public/calendar/'+id+'/events.json' 
        //id+"/data/events.json"
    });
    switch(window.location.protocol) {
        case 'http:':
        case 'https:':
            // running on a server, should be good.
            break;
        case 'file:':
            alert('Just a heads-up, events will not work when run locally.');
    }

    document.querySelector('#izbrisi').onclick = function() {
        let action = "Ali res želite izbirisati nalogo? S pritiskom na gumb Izbriši bo naloga dokočno izbrisana in do nje ne boste mogli več dostopati!";
        if (document.getElementById("dialog-title").innerHTML == "Uredi cilj")action = "Ali res želite izbirisati cilj? S pritiskom na gumb Izbriši bo vaš cilj dokočno izbrisan in do njega ne boste mogli več dostopati!";     
        let m = confirm(action);
        console.log(m);
        if(m) potrdiIzbris();
    }

    let dialog = document.querySelector('dialog');
    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }

    let closeBtn = document.querySelectorAll('.closeX');
    for( let x = 0;x < closeBtn.length; x++) {        
        closeBtn[x].onclick = function() {
            closeBtn[x].parentNode.classList.add("hide-element");
        }
    }
    dialog.querySelector('.close').onclick = function() {
        dialog.close();
        deleteHints();
    };

    function onOpomnikClick(opomnikiList, callback) {
        let list = document.getElementById(opomnikiList),
            rows = list.getElementsByTagName("li"),i;
        for (i = 0; i < rows.length; i++) {
            rows[i].onclick = function (row) {
                return function () {
                    callback(row);
                };
                console.log(row, "row");
            }(rows[i]);
        }
    }

    onOpomnikClick("opomnikiList", function (row){
        napolniNalogo(row);
        console.log(row);
    });

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

    $("#pickZac").datepicker({
        language: 'sl',
        timeFormat: "hh:ii",
        clearButton: "true", 
        position: "right top",
        onSelect: function onSelect(fd, date) {
            $("#targetZacetek").val(fd);
            $("#dateZacetek").val(date);
            document.getElementById("dialogZacetek").MaterialTextfield.checkDirty();
        }        
    });

    $("#pickKon").datepicker({
        language: 'sl',
        timeFormat: "hh:ii",
        clearButton: "true",
        onSelect: function onSelect(fd, date) {
            $("#targetKonec").val(fd);
            $("#dateKonec").val(date);
            document.getElementById("dialogKonec").MaterialTextfield.checkDirty();
        }        
    });

    $("#dialogZacetek").click(function(e) {  
        console.log("open");
        let pickerZac = $("#pickZac");   
        pickerZac.removeClass("hide-element");        
        $(document).mouseup(function(e) {            
            // if the target of the click isn't the container nor a descendant of the container
            if (!pickerZac.is(e.target) && pickerZac.has(e.target).length === 0) 
            {
                pickerZac.addClass("hide-element");
            }
        });
    });

    $("#dialogKonec").click(function(e) {  
        console.log("open");
        let pickerZac = $("#pickKon");   
        pickerZac.removeClass("hide-element");        
        $(document).mouseup(function(e) {            
            // if the target of the click isn't the container nor a descendant of the container
            if (!pickerZac.is(e.target) && pickerZac.has(e.target).length === 0) 
            {
                pickerZac.addClass("hide-element");
            }
        });
    });

    $("#nalogaDone").click(function(e) {  
        let data = "newDialog="+$("#opomnikId").val()+"&status=true&mode=1";
        $.ajax({
            url: '/ustvari_nalogo',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data: data,
            success: function(response){
                localStorage.setItem("Status",response);
                localStorage.setItem("Stran",0);
                window.location.reload(true);
            },
            error: function(response, jqXhr, textStatus, errorThrown){            
                let snackbarContainer = document.querySelector('#mainToast');             
                snackbarContainer.MaterialSnackbar.showSnackbar({message: response});
                console.log(jqXhr, textStatus, errorThrown, response);
            }
            
        });

    });
});

function clearData() {
    $('#newDialog').val("");
    $('#imeDialog').val("").parent().removeClass("is-dirty");
    $('#opisDialog').val("").parent().removeClass("is-dirty");
    $('#targetZacetek').val("").parent().removeClass("is-dirty");
    $('#targetKonec').val("").parent().removeClass("is-dirty");
    $('#oldStatus').val("");
    $('#newStatus').val("");
    $('#xpNaloge').val("").parent().removeClass("is-dirty");
    $('#vezanCilj').get(0).placeholder = "";
    $("input[name='sampleCilj']").parent().removeClass("is-dirty").find("li").removeAttr('data-selected');
    getmdlSelect.init("#dialogCilj");
    $('#kategorija').get(0).placeholder = "";
    $("input[name='sampleKategorija']").parent().removeClass("is-dirty").find("li").attr('data-selected','');
    getmdlSelect.init("#dialogKategorija");
    /*
    $('#statusNaloge').get(0).placeholder = "";
    $("#statusNaloge").parent().removeClass("is-dirty")
        .find("li").attr('data-selected','');
    getmdlSelect.init("#dialogStatus");*/
    $('#listClani').find("input[type='checkbox']").parent().removeClass('is-checked');
}

function fillNaloge() {
    $('#iDialog').html("Ime naloge*");
    $('#oDialog').html("Opis naloge*");
    $('#tZacetek').html("Začetek naloge");
    $('#tKonec').html("Konec naloge");
    $('#ciljiVsi').attr('style',"display: none!important");
    $('#dialogKategorija').attr('style',"display: block!important");
    $('#dialogZacetek').attr('style',"display: block!important");
    $('#dialogKonec').attr('style',"display: block!important");
    $('#claniNaloge').attr('style',"display: block!important");
    $('#dialogCilj').attr('style',"display: block!important");
    $('#dialogStatus').attr('style',"display: block!important");
    $('#ustvari').attr('onclick',"validateNaloga(event, 0)");
    $("#closeBtn").next().removeClass("color-cyan").addClass("color-red");
    $("#dialog-hint").attr('onclick',"helpNaloga()");
}

function fillCilji() {
    $('#iDialog').html("Ime cilja*");
    $('#oDialog').html("Opis cilja*");
    /*
    $('#tZacetek').html("Zacetek cilja");
    $('#tKonec').html("Konec cilja");*/
    $('#ciljiVsi').attr('style',"display: block!important");
    $('#dialogKategorija').attr('style',"display: none!important");
    $('#dialogZacetek').attr('style',"display: none!important");
    $('#dialogKonec').attr('style',"display: none!important");
    $('#claniNaloge').attr('style',"display: none!important");
    $('#dialogCilj').attr('style',"display: none!important");
    $('#dialogStatus').attr('style',"display: none!important");
    $('#ustvari').attr('onclick',"validateNaloga(event, 1)");
    $("#closeBtn").next().removeClass("color-red").addClass("color-cyan");
    $("#dialog-hint").attr('onclick',"helpCilji()");
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
    $("#izbrisi").removeClass("hide-element");
    currentElement = row;
}

function posodobiNalogo() {    
    clearData();
    fillNaloge();    
    document.getElementById("dialog-title").innerHTML = "Uredi nalogo";
    document.getElementById("ustvari").innerHTML = "Posodobi";
    dialog.showModal();
    $("#dialog-div").attr('style', 'height: '+$("#dialog").height() + 'px;');
    $("#izbrisi").removeClass("hide-element");
}

function dodajNovCilj() {
    clearData();
    fillCilji();    
    document.getElementById("dialog-title").innerHTML = "Dodaj nov cilj";
    document.getElementById("ustvari").innerHTML = "Ustvari";
    //$('#newDialog').val("");
    dialog.showModal();
    //$("#dialog-div").attr('style', 'height: auto');
    $("#izbrisi").addClass("hide-element");
}

function dodajNovoNalogo() {
    clearData();
    fillNaloge();
    document.getElementById("dialog-title").innerHTML = "Dodaj novo nalogo";
    document.getElementById("ustvari").innerHTML = "Ustvari";
    $('#newDialog').val("");
    dialog.showModal();
    $("#dialog-div").attr('style', 'height: '+$("#dialog").height() + 'px;');
    $("#izbrisi").addClass("hide-element");
}

function dodajPredlog() {    
    clearData();
    fillNaloge();
    document.getElementById("dialog-title").innerHTML = "Dodaj novo nalogo";
    document.getElementById("ustvari").innerHTML = "Ustvari";
    $('#newDialog').val("");   
    dialog.showModal(); 
    $("#dialog-div").attr('style', 'height: '+$("#dialog").height() + 'px;');
    $("#izbrisi").addClass("hide-element");
    $('#imeDialog').val($("#ime_aktivnosti").text()).parent().addClass("is-dirty");
    $('#opisDialog').val($("#opis_aktivnosti").text()).parent().addClass("is-dirty");
    $('#xpNaloge').val("100").parent().addClass("is-dirty");
    $('#kategorija').get(0).placeholder = $(".list-kategorija").find("[data-val=5aeabcd8be609116280b4d9c]").get(0).textContent.trim();
    $("input[name='sampleKategorija']").parent().addClass("is-dirty").find("li[data-val=5aeabcd8be609116280b4d9c]").attr('data-selected','true');
    getmdlSelect.init("#dialogKategorija");    
    $('#statusNaloge').get(0).placeholder = "Neopravljena";
    $("#dialogStatus").find("li[data-val=false]").attr('data-selected','true');
    $("#statusNaloge").parent().addClass("is-dirty");
    $("input[name='oldStatus']").val("false");
    $("input[name='newStatus']").val("false");     
    getmdlSelect.init("#dialogStatus");  
    

}

function validateNaloga(event, t) {
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
    if (t==0) {
        let dZac = document.forms["update_dialog"]["dateZacetek"].value;
        let dKon = document.forms["update_dialog"]["dateKonec"].value;
        if (dZac != "" && dKon != "") {
            if (moment(dZac).isAfter(dKon)) {
                $("#dateKonecErr").text("Datum konca mora biti po datumu začetka!").parent().addClass("is-invalid");
                return false;
            }
        }
        /*
        if (document.forms["update_dialog"]["vezanCilj"].value == "") {
            alert("Vezan cilj mora biti izbran.");
            return false;
        }*/
        if (document.forms["update_dialog"]["sampleKategorija"].value == "") {
            alert("Kategorija mora biti izbrana.");
            return false;
        }
        if (document.forms["update_dialog"]["statusNaloge"].value == "") {
            alert("Status naloge mora biti izbran.");
            return false;
        }
        //console.log("cilj");
    }
    if(t == 0) {
        let save = $( "#update_dialog" ).serialize();
        event.preventDefault();
        console.log(save);
        $.ajax({
            url: '/ustvari_nalogo',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data: save,
            success: function(response){
                localStorage.setItem("Status",response);          
                localStorage.setItem("Stran", 2);
                window.location.reload(true);

                /*
                let snackbarContainer = document.querySelector('#mainToast');            
                snackbarContainer.MaterialSnackbar.showSnackbar({message: response});
                queryNaloge();
                dialog.close(); */
            },
            error: function(response, jqXhr, textStatus, errorThrown){            
                let snackbarContainer = document.querySelector('#mainToast');             
                snackbarContainer.MaterialSnackbar.showSnackbar({message: response});
                console.log(jqXhr, textStatus, errorThrown, response);
            }
            
        });
    } else {
        let save = $( "#update_dialog" ).serialize();
        event.preventDefault();
        $.ajax({
            url: '/ustvari_cilj',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data: save,
            success: function(response){
                localStorage.setItem("Status",response);
                localStorage.setItem("Stran",3);           
                window.location.reload(true);

                /*
                let snackbarContainer = document.querySelector('#mainToast');             
                snackbarContainer.MaterialSnackbar.showSnackbar({message: response});
                if($("#newDialog").val()) {
                    currentElement.getElementsByTagName("td")[0].lastElementChild.lastElementChild.children[0].innerHTML = document.forms["update_dialog"]["imeDialog"].value;
                    currentElement.getElementsByTagName("td")[0].lastElementChild.lastElementChild.children[1].innerHTML = document.forms["update_dialog"]["opisDialog"].value
                    let temp = currentElement.getElementsByTagName("td")[0].lastElementChild.lastElementChild.children[2].innerHTML.split(" ");
                    currentElement.getElementsByTagName("td")[0].lastElementChild.lastElementChild.children[2].innerHTML = temp[0]+"/"+document.forms["update_dialog"]["xpNaloge"].value;
                } else {
                    window.location.reload(false);
                }
                dialog.close();
                */
            },
            error: function( jqXhr, textStatus, errorThrown, response){               
                let snackbarContainer = document.querySelector('#mainToast');             
                snackbarContainer.MaterialSnackbar.showSnackbar({message: response});
            }            
        });
        
    }
}
/*
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
*/
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
    $("#druzina").removeClass("is-active");
    $("#settings").addClass("is-active");
}

function openNotifications() {
    cleanNav();
    $("#druzina").removeClass("is-active");
    $("#settings").removeClass("is-active");
    $("#notifications").addClass("is-active");
}

function openDruzina() {
    cleanNav();
    $("#settings").removeClass("is-active");
    $("#notifications").removeClass("is-active");
    $("#druzina").addClass("is-active");
}



//PUSH NOTIFICATIONS
function initializeUI() {
    pushButton.addEventListener('click', function() {
        pushButton.disabled = true;
        $("#pushButton").parent().addClass("is-disabled");
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
            //was commented
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
            updateSubscriptionOnServer(subscription, '/api/save-subscription');

            console.log('User is subscribed.');

            isSubscribed = true;

            updateBtn();
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
}

function updateSubscriptionOnServer(subscription, url) {
    return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
            subscription: subscription,
            user_id: $("#trenutniUporabnik").val()
        })
      })
      .then(function(response) {
        if (!response.ok) {
            console.log(response);
          throw new Error('Bad status code from server.', response);
         
        }    
        return response.json();
      })
      .then(function(responseData) {
        if (!(responseData.data && responseData.data.success)) {
          throw new Error('Bad response from server.', responseData);
        }
      });
}

function unsubscribeUser() {
    let sub;
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            sub = subscription;
            if (subscription) {
                return subscription.unsubscribe();                
            }
        })
        .catch(function(error) {
            console.log('Error unsubscribing', error);
        })
        .then(function() {
            updateSubscriptionOnServer(sub, '/api/disable-subscription');
            //console.log(subscription, "was null");
            //updateSubscriptionOnServer(null, '/api/disable-subscription');

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
        pushButton.nextElementSibling.textContent = 'Obvestila niso dovoljena';
        pushButton.disabled = true;
        $("#pushButton").parent().addClass("is-disabled");
        updateSubscriptionOnServer(null);
        return;
      }

    $("#pushButton").removeAttr("disabled");
    $("#pushButton").parent().removeClass("is-disabled");

    let label = document.querySelector("#prePush");
    
    if (isSubscribed) {
        pushButton.nextElementSibling.textContent = 'Izklopi obvestila v brskalniku';
        label.MaterialSwitch.on();
           
    } else {
        if($('#pushButton').parent().is('.is-checked')) {label.MaterialSwitch.off();}
        pushButton.nextElementSibling.textContent = 'Vklopi obvestila v brskalniku';
    }
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
        //$("#"+razmerje+i).text(sumXP+"/"+$("."+prg+i).parent().prev().prev().find("input[name=maxXp]").val());
        if(stUporabnikov==0) {
            $("."+prg+i).attr('style',"display: none!important");
        } else if (stUporabnikov == 1) {
            $("."+prg+i+" :nth-child(1)").addClass("spanOnly");
        } else {
            $("."+prg+i+" :nth-child(1)").attr('style',"width: "+(curr[0].innerHTML/sumXP)*100+"%; background-color: #BCD4F8").addClass("spanFirst");
            for (let j=2; j<stUporabnikov; j++) {
                let span = $("."+prg+i+" :nth-child("+j+")");
                span.attr('style',"width: "+(curr[j-1].innerHTML/sumXP)*100+"%; background-color: "+colors[j-2]+";");
            }
            $("."+prg+i+" :nth-child("+stUporabnikov+")").attr('style',"width: "+(curr[stUporabnikov-1].innerHTML/sumXP)*100+"%; background-color: #96ECED;").addClass("spanLast");
            //console.log($("."+prg+i+" :nth-child("+stUporabnikov+")"));
        }
    }
}

function zapriNalogo() {
    $("#NalogaPopUp").css("display", "none");
}

function distanceX(elem) {
    // Get an element's distance from the top of the page
    var getElemDistance = function ( elem ) {
        var location = 0;
        if (elem.offsetParent) {
            do {
                location += elem.offsetTop;
                elem = elem.offsetParent;
            } while (elem);
        }
        return location >= 0 ? location : 0;
    };
    var location = getElemDistance( elem );
    return(location);
}


function napolniNalogo(elem) {
    deleteShowNaloga(elem);
    elem = elem.children[1];
    console.log(elem);
    $("#dashboardNaloga").removeClass("hide-element");
    $("#opomnikKategorija").text(elem.lastElementChild.children[0].value);
    let dz = elem.lastElementChild.children[1].value;
    $("#opomnikZacetek").text(moment(dz).format('DD. MM. YYYY') +" "+ moment(dz).format('HH:mm'));
    let dk = elem.lastElementChild.children[2].value;
    $("#opomnikKonec").text(moment(dk).format('DD. MM. YYYY') +" "+ moment(dk).format('HH:mm'));
    
    $("#opomnikCilj").append(elem.lastElementChild.children[3].value);
    $("#opomnikId").val(elem.lastElementChild.children[4].value);
    console.log(elem.lastElementChild.children[4].value);

    $("#opomnikIme").text(elem.children[0].children[0].innerHTML);
    $("#opomnikOpis").text(elem.children[0].children[2].innerHTML);  
    $("#opomnikXp").text("+"+elem.children[0].children[1].children[0].innerHTML);  

    let m = elem.lastElementChild.children[5].cloneNode(true);
    let n = elem.lastElementChild.children[6].cloneNode(true);
    n.classList.remove("hide-element");
    m.classList.remove("hide-element")
    document.getElementById("opomnikVezani").appendChild(m);
    document.getElementById("opomnikAvtor").appendChild(n);

    if (dz == "" || dk == "") {
        $("#opomnikBrezDatuma").removeClass("hide-element");
    }    
}

function deleteShowNaloga(elem) {
    $("#opomnikKategorija").text("");
    $("#opomnikXp").text("");
    $("#opomnikIme").text("");
    $("#opomnikOpis").text("");
    $("#opomnikVezani").empty();
    $("#opomnikAvtor").empty();
    $("#opomnikKategorija").text("");
    $("#opomnikZacetek").text("");
    $("#opomnikKonec").text("");
    $("#opomnikBrezDatuma").addClass("hide-element");
    $("#opomnikCilj").html( $("#opomnikCilj").children());
}

function potrdiIzbris () {
    let url = "/delete-naloga";
    if (document.getElementById("dialog-title").innerHTML == "Uredi cilj") url = "/delete-cilj";
    let save = "id="+document.forms["update_dialog"]["newDialog"].value;
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: save,
        success: function(response){
            localStorage.setItem("Status",response);
            let stran = 3;
            if (url=="/delete-naloga") {let stran =  2;}
            localStorage.setItem("Stran", stran);
            window.location.reload(true);
            /*
            let snackbarContainer = document.querySelector('#mainToast');            
            snackbarContainer.MaterialSnackbar.showSnackbar({message: response});
            dialog.close();
            if (url == "/delete-naloga") {
                queryNaloge();
            } else {                
                currentElement.classList.add("hide-element");
            }*/
        },
        error: function( jqXhr, textStatus, errorThrown, response){         
            let snackbarContainer = document.querySelector('#mainToast');             
            snackbarContainer.MaterialSnackbar.showSnackbar({message: response});
        }            
    });
}

function chooseHelp() {
      if ($("#dashboard").hasClass("is-active")) {startIntroDashboard();console.log("dash");}
      if ($("#koledar").hasClass("is-active"))  {startIntroKoledar();console.log("cal");}
      if ($("#naloge").hasClass("is-active"))  {startIntroNaloge();console.log("nal");}
      if ($("#cilj").hasClass("is-active"))  {startIntroCilj();console.log("cilj");}
      if ($("#settings").hasClass("is-active"))  {startIntroSettings();console.log("set");}
      if ($("#notifications").hasClass("is-active"))  {startIntroNotifications();console.log("notf");}
      if ($("#druzina").hasClass("is-active"))  {startIntroDruzina();console.log("drz");}
}

function startIntroDashboard(){
    intro = introJs();
      intro.setOptions({
        nextLabel: 'Naprej &rarr;',
        prevLabel: '&larr; Nazaj',
        skipLabel: 'Zapri',
        doneLabel: 'Konec',
        tooltipPosition: "auto",
        overlayOpacity: 0.5,
        steps: [
          { 
            intro: "Pozdravljeni v aplikaciji MyFamily! Kliknili ste na gumb pomoč, ki se nahaja v spodnjem levem kotu. Ob kliku na gumb boste sprožili začetek predstavitve, ki vam bo razložila osnovne funkcionalnosti na strani kjer se nahajate. Če želite nadaljevati s predstavitvijo strani pregled pritisnite gumb naprej."
            +"Predstavitev lahko kadarkoli prekinete."
          },
          {
            element: document.querySelector('#dash1'),
            intro: "Navigacijska vrstica s pomočjo katero se premikate po aplikaciji. Aplikacija je sestavljena iz 4 glavnih podstrani: PREGLED - pregled celotne aplikacije, KOLEDAR -"
            +" koledar kjer so prikazane naloge, NALOGE - stran, kjer lahko iščete po nalogah in CILJI - stran kjer so podrobneje prikazani cilji družine",
          },
          {
            element: document.querySelector('#opomnikiList'),
            intro: "Opomniki za naloge pri katerih sodelujete. Prihajajoče naloge imajo pred sabo zelen krog, naloge, ki se začnejo"
            +" na današnji dan imajo rumen krog, naloge, ki so se že začele pa rdeč krog. Ob kliku na opomnik se prikažejo podrobnosti naloge.",
          },
          {
            element: '#dash3',
            intro: 'Status, s katerim lahko sporočite družini kaj počnete, kako se počutite, kdaj boste naredili nalogo...',
          },
          {
            element: '#dash4',
            intro: "Družinsko drevo, člani družine so urejeni glede na položaj v družini. Najvišje v drevesu so pradedki in prababice, nato dedki in babice, starši, otroci. Če oseba nima izbranega položaja v družini je prikazana na vrhu drevesa. S klikom na avatar lahko odprete okno kjer lahko vidite status osebe, različne možnosti sporočanja in število točk, ki jih je ta oseba danes zbrala.",
          },
          {
            element: '#dash5',
            intro: "Skupni cilji družine, te cilje si družina izbere kot najpomembnejše in zato so prikazani na pregledu. Od leve proti desni so ime in opis cilja, razmerje med dosedaj zbranimi točkami in točkami potrebnimi za izpolnitev cilja, ter točke prikazane za vsakega člana družine posebej."
          },
          {
            element: '#dash6',
            intro: "Predlog za novo nalogo, ki je nakljčno generiran. S klikom na gumb DODAJ NALOGO se bodo polja avtomatsko izpolnila in nato lahko predlagano nalogo dodate med svoje naloge."
          },
          {
            element: document.querySelector('#dash7'),
            intro: "Tukaj se nahajajo osebne nastavitve, kjer lahko kadarkoli spremnite podatke, ki ste jih napisali ob registraciji. V menuju se nahajajo tud nastanitve sporočanja, kjer lahko vklopite sporočila preko e-pošte, sporočil sms in obvestila na vašem pametnem telefonu. V meniju lahko k uporabi aplikacije povabite tudi druge družinske člane."
          },
        ]
      });
      intro.start();
  }

function startIntroKoledar(){
    intro = introJs();
    $('.monthly-header-title').attr('id', 'cal2');
    $('.monthly-day-wrap').attr('id', 'cal3');
        intro.setOptions({
        nextLabel: 'Naprej &rarr;',
        prevLabel: '&larr; Nazaj',
        skipLabel: 'Zapri',
        doneLabel: 'Konec',
        tooltipPosition: "auto",
        overlayOpacity: 0.5,
        steps: [
            {
            element: '#cal1',
            intro: "Tole je okno z koledarjem. Na njem so prikazane naloge, glede na začetni datum naloge.",
            },
            {
            element: '#cal2',
            intro: "Tole je navigacijska vrstica koledarja. S puščicama se lahko premikate po mesecih naprej ali nazaj. Gumb danes vrne pogled na današnji dan. Gumb mesec pa vrne pogled na mesec v katerem je dan na katerem se nahajate.",
            },
            {
            element: '#cal3',
            intro: "Posamezni dnevi v katerih so prikazane naloge. Če kliknete na nalogo se vam bo odprl podroben opis naloge. Če pa kliknete na dan se vam bo odrl pogled z vsemi nalogami, ki potekajo na današnji dan.",
            }
        ]
    });
    intro.start();
}

function startIntroNaloge(){
    intro = introJs();
      intro.setOptions({        
        tooltipPosition: "auto",
        nextLabel: 'Naprej &rarr;',
        prevLabel: '&larr; Nazaj',
        skipLabel: 'Zapri',
        doneLabel: 'Konec',
        overlayOpacity: 0.5,
        steps: [
        {
            element: '#nal1',
            intro: "S pomočjo tega okna lahko iščete po nalogah. Izbirate lahko med različnimi parametri, ki vam bodo pomagali poiskati nalogo.\n\nVezan cilj - Cilj na katerega je vezana naloga.\nKategorija - kategorija v katero spada naloga.\nZa koga - komu je naloga namenjena.\nStatus - ali je naloga opravljena ali neopravljena.\nAvtor - avtor naloge.\nV koledarju - ali je naloga časovno definirana",
            position: "bottom-right",
        },
        {
            element: '#card0',
            intro: "Rezultat iskanja. Naloge iz iste kategorije imajo zgornji del obarvan z isto barvo. Posamezen okvir predstavlja eno nalogo. Če kliknete na gumb v spodnjem desnem kotu lahko nalogo urejate.",
        },
        {
            element: document.querySelector('#dash1'),
            intro: "Tole je navigacijska vrstica. Aplikacija je sestavljena iz 4 različnih podstrani: PREGLED - pregled celotne aplikacije, KOLEDAR -"
            +" koledar kjer so prikazane naloge, NALOGE - stran, kjer lahko iščete po nalogah in CILJI - stran kjer so podrobneje prikazani cilji družine",
        },
        {
            element: document.querySelector('#dash7'),
            intro: "Tukaj se nahajajo osebne nastavitve, kjer lahko kadarkoli spremnite podatke, ki ste jih napisali ob registraciji. V meniju se nahajajo tudi nastanitve sporočanja, kjer lahko vklopite sporočila preko e-pošte, sporočila sms in obvestila na vašem pametnem telefonu. V meniju je tudi povezava do strani kjer lahko k uporabi aplikacije povabite tudi druge družinske člane."
        },
        ]
    });
    intro.start();
  }

  function startIntroCilj(){
    intro = introJs();
      intro.setOptions({
        nextLabel: 'Naprej &rarr;',
        prevLabel: '&larr; Nazaj',
        skipLabel: 'Zapri',
        doneLabel: 'Konec',
        tooltipPosition: "auto",
        overlayOpacity: 0.5,
        steps: [
        {
            element: '#table-cilji',
            intro: "V tem oknu so prikazani vsi nedoseženi cilji družine. Cilj lahko urejate z klikom na vrstico v tabeli. Od leve proti desni ime in opis cilja, razmerje med dosedaj zbranimi točkami in točkami potrebnimi za izpolnitev cilja, točke prikazane za vsakega člana družine posebej, datum kdaj je bil cilj ustvarjen in kdaj je bil cilj nazadnje posodobljen."
        },
        {
            element: '#table-cilji-end',
            intro: "V tem oknu so prikazani vsi cilji družine, ki so že zaključeni. Cilj lahko urejate z klikom na vrstico v tabeli. Od leve proti desni ime in opis cilja, razmerje med dosedaj zbranimi točkami in točkami potrebnimi za izpolnitev cilja, točke prikazane za vsakega člana družine posebej, datum kdaj je bil cilj ustvarjen in kdaj je bil cilj nazadnje posodobljen."
        },
        {
            element: document.querySelector('#dash1'),
            intro: "Tole je navigacijska vrstica. Aplikacija je sestavljena iz 4 različnih podstrani: PREGLED - pregled celotne aplikacije, KOLEDAR -"
            +" koledar kjer so prikazane naloge, NALOGE - stran, kjer lahko iščete po nalogah in CILJI - stran kjer so podrobneje prikazani cilji družine",
        },
        {
            element: document.querySelector('#dash7'),
            intro: "Tukaj se nahajajo osebne nastavitve, kjer lahko kadarkoli spremnite podatke, ki ste jih napisali ob registraciji. V meniju se nahajajo tudi nastanitve sporočanja, kjer lahko vklopite sporočila preko e-pošte, sporočila sms in obvestila na vašem pametnem telefonu. V meniju je tudi povezava do strani kjer lahko k uporabi aplikacije povabite tudi druge družinske člane."
        },
        ]
      });
      intro.start();
  }

  function startIntroSettings(){
    intro = introJs();
      intro.setOptions({
        nextLabel: 'Naprej &rarr;',
        prevLabel: '&larr; Nazaj',
        skipLabel: 'Zapri',
        doneLabel: 'Konec',
        tooltipPosition: "auto",
        overlayOpacity: 0.5,
        steps: [
        { 
        intro:"Trenutno se nahajate na strani z osebnimi nastavitavami. Tukaj lahko spremenite svoje podatke o imenu, e-pošti, telefoni, svoj položaj v družini, prikazno sliko in svoje geslo za dostom do aplikacije. Za izhod iz osebnih nastavitev kliknite na izmed 4 strani v navigacijski vrstici.",
        },
        {
        element: document.querySelector('#dash1'),
        intro: "Navigacijska vrstica. Aplikacija je sestavljena iz 4 različnih podstrani: PREGLED - pregled celotne aplikacije, KOLEDAR -"
        +" koledar kjer so prikazane naloge, NALOGE - stran, kjer lahko iščete po nalogah in CILJI - stran kjer so podrobneje prikazani cilji družine",
        },
        {
        element: document.querySelector('#dash7'),
        intro: "Tukaj se nahajajo osebne nastavitve, kjer lahko kadarkoli spremnite podatke, ki ste jih napisali ob registraciji. V meniju se nahajajo tudi nastanitve sporočanja, kjer lahko vklopite sporočila preko e-pošte, sporočila sms in obvestila na vašem pametnem telefonu. V meniju je tudi povezava do strani kjer lahko k uporabi aplikacije povabite tudi druge družinske člane."
        },
        ]
      });
      intro.start();
  }

  function startIntroNotifications(){
    intro = introJs();
      intro.setOptions({
        nextLabel: 'Naprej &rarr;',
        prevLabel: '&larr; Nazaj',
        skipLabel: 'Zapri',
        doneLabel: 'Konec',
        tooltipPosition: "auto",
        overlayOpacity: 0.5,
        steps: [
        { 
        intro:"Trenutno se nahajate na strani z nastavitvami sporočanja. Obvestila iz aplikacije lahko prejmete na tri različne načine: SMS, e-pošta in push obvestila v brskalniku ali na telefonu.",
        },
        {
        element: document.querySelector('#dash1'),
        intro: "Navigacijska vrstica. Aplikacija je sestavljena iz 4 različnih podstrani: PREGLED - pregled celotne aplikacije, KOLEDAR -"
        +" koledar kjer so prikazane naloge, NALOGE - stran, kjer lahko iščete po nalogah in CILJI - stran kjer so podrobneje prikazani cilji družine",
        },
        {
        element: document.querySelector('#dash7'),
        intro: "Tukaj se nahajajo osebne nastavitve, kjer lahko kadarkoli spremnite podatke, ki ste jih napisali ob registraciji. V meniju se nahajajo tudi nastanitve sporočanja, kjer lahko vklopite sporočila preko e-pošte, sporočila sms in obvestila na vašem pametnem telefonu. V meniju je tudi povezava do strani kjer lahko k uporabi aplikacije povabite tudi druge družinske člane."
        },
        ]
      });
      intro.start();
  }

  function startIntroDruzina(){
    intro = introJs();
      intro.setOptions({
        nextLabel: 'Naprej &rarr;',
        prevLabel: '&larr; Nazaj',
        skipLabel: 'Zapri',
        doneLabel: 'Konec',
        tooltipPosition: "auto",
        overlayOpacity: 0.5,
        steps: [
        { 
        intro:"Trenutno ste na strani kjer lahko k uporabi aplikacije povabite tudi druge družinske člane. V polje E-mail napištite e-poštni naslov osebe, ki jo želite povabiti v vašo družino. Na naslov bo nekaj minutah prispelo elektronsko sporočilo z podrobnimi navodili za včlanitev v družino.",
        },
        {
        element: document.querySelector('#dash1'),
        intro: "Tole je navigacijska vrstica. Aplikacija je sestavljena iz 4 različnih podstrani: PREGLED - pregled celotne aplikacije, KOLEDAR -"
        +" koledar kjer so prikazane naloge, NALOGE - stran, kjer lahko iščete po nalogah in CILJI - stran kjer so podrobneje prikazani cilji družine",
        },
        {
        element: document.querySelector('#dash7'),
        intro: "Tukaj se nahajajo osebne nastavitve, kjer lahko kadarkoli spremnite podatke, ki ste jih napisali ob registraciji. V meniju se nahajajo tudi nastanitve sporočanja, kjer lahko vklopite sporočila preko e-pošte, sporočila sms in obvestila na vašem pametnem telefonu. V meniju je tudi povezava do strani kjer lahko k uporabi aplikacije povabite tudi druge družinske člane."
        },
        ]
      });
      intro.start();
  }


function helpNaloga(){
    if (move == 0) {
        intro.removeHints();
        intro = introJs();
        intro.setOptions({        
        hintButtonLabel: 'Razumem!',
        hintPosition: 'top-right',
        hintAnimation: 'false',       
        hints: [
            {
                element: '#imeDialog',
                hint: "Prikazno ime naloge. Lahko vsebuje do 32 znakov.",
                position: 'left'
            },
            {
                element: '#opisDialog',
                hint: "Opis naloge, kaj je potrebno narediti, da je naloga dosežena.",
                position: 'left'
            },
            {
                element: '#targetZacetek',
                hint: "Datum začetka naloge. Naloga je v koledar postavljena glede na njen začetni datum. Če naloga nima izbranega začetnega datuma, je njen začetni datum kadar je bila ustvarjena.",
                position: 'left'
            },
            {
                element: '#targetKonec',
                hint: "Datum konca naloge. S tem datum določite do kdaj mora biti naloga opravljena, oziroma kdaj je bila opravljena. V primeru, da končni datum ni izbran je avtomatsko določen na isti dan kot začetni datum.",
                position: 'left'
            },
            {
                element: '#vezanCilj',
                hint: "Cilj na katerega je vezana naloga. Ko je naloga opravljena se pod ta cilj štejejo točke naloge.",
                position: 'left'
            },
            {
                element: '#kategorija',
                hint: "Kategorija v katero spada naloga.",
                position: 'left'
            },
            
            {
                element: '#xpNaloge',
                hint: "Vrednost naloge, ko je opravljena se te naloge prištejejo k vezanemu cilju.",
                position: 'bottom'
            },
            {
                element: '#statusNaloge',
                hint: "Status naloge, lahko je opravljena ali pa neopravljena.",
                position: 'left'
            },
            {
                element: '#claniNaloge',
                hint: "Družinski člani, označite tiste katerim je naloga namenjena.",
                position: 'left'
            }
            ]
        });
        intro.onhintsadded(function() {
            console.log('all hints added');
            if (move == 0) moveHints("#hintNal");
        });
        intro.onhintclick(function(hintElement, item, stepId) {
            //console.log('hint clicked', hintElement, item, stepId);
            setTimeout(function () { 
                let element = $(".introjs-tooltipReferenceLayer");
                element.appendTo($("#hintNal"));
                let pos = $("#dialog").get(0).getBoundingClientRect();
                element.addClass('notransition');
                let top = $(hintElement).offset().top - $(hintElement).parent().offset().top - $(hintElement).parent().scrollTop()
                element.css({"color" : "black", "top" : top-5, "left" : hintElement.getBoundingClientRect().left - pos.left-2});
                $('[data-step*="6"].introjs-tooltipReferenceLayer').css({"color" : "black", "top" : top+15, "left" : hintElement.getBoundingClientRect().left - pos.left-20});
            }, 1);

        });
        intro.onhintclose(function (stepId) {
            console.log('hint closed', stepId);
        });
        intro.addHints();
        
        console.log("move 1");
    }
    else if (shown == 0) {
        intro.showHints();
        shown = 1;
    }
    else if (shown == 1) {
        intro.hideHints();
        shown = 0;
    } 
    move = 1;
}

  function helpCilji(){
    if (move == 0) {
        intro.removeHints();
        intro = introJs();
        intro.setOptions({  
            hintButtonLabel: 'Razumem!',
            hintPosition: 'top-right', 
            hintAnimation: "false",     
            hints: [
            {
                element: '#imeDialog',
                hint: "Prikazno ime cilja. Lahko vsebuje do 32 znakov.",
                position: "left"
            },
            {
                element: '#opisDialog',
                hint: "Opis aktivnosti, ki jih vsebuje cilj.",
                position: "left"
            },
            {
                element: '#xpNaloge',
                hint: "Število točk potrebnih za dosego cilja.",
                position: "bottom"
            },
            {
                element: '#ciljiVsi',
                hint: "Če je to okno obkljukano se bo cilj vsem članom družine prikazal na prvi strani med skupnimi cilji.",
                position: "left"
            }
            ]
        });
        intro.onhintclose(function (stepId) {
            console.log('hint closed', stepId);
        });
        intro.onhintsadded(function() {
            console.log('all hints added');
            if (move == 0) moveHints("#dialog");
        });
        intro.onhintclick(function(hintElement, item, stepId) {
            console.log('hint clicked', hintElement, item, stepId);
            setTimeout(function () { 
                let element = $(".introjs-tooltipReferenceLayer");
                element.appendTo($("#dialog"));
                let pos = $("#dialog").get(0).getBoundingClientRect();
                element.addClass('notransition');
                let top = $(hintElement).offset().top - $(hintElement).parent().offset().top - $(hintElement).parent().scrollTop()
                element.css({"color" : "black", "top" : top-20, "left" : hintElement.getBoundingClientRect().left - pos.left-2});
                $('[data-step*="2"].introjs-tooltipReferenceLayer').css({"color" : "black", "top" : top, "left" : hintElement.getBoundingClientRect().left - pos.left-20})
                //element.css({"top" : element.get(0).getBoundingClientRect().top - 2*pos.top, "left" : element.get(0).getBoundingClientRect().left - 2*pos.left});
            }, 1);        
        });
        intro.addHints();
        console.log("move 1");
    }
    else if (shown == 0) {
        console.log("show 1");
        intro.showHints();
        shown = 1;
    }
    else if (shown == 1) {
        console.log("hide 1");
        intro.hideHints();
        shown = 0;
    }      
    
    move = 1;
  }


function pregled() {
    let clean_uri = location.protocol + "//" + location.host + location.pathname;
    window.history.replaceState({}, document.title, clean_uri);
    localStorage.setItem("Stran", 1);
    window.location.reload(true);
}

function moveHints(loc) {
    shown = 1;
    $(".introjs-hints").prependTo($(loc));     
    let pos = $(loc).get(0).getBoundingClientRect();           
    $( ".introjs-hint" ).each(function( index, element ) {            
        let x = element.getBoundingClientRect().left - 2*pos.left;
        let y = element.getBoundingClientRect().top - 2*pos.top;   
        element.setAttribute("style", "left: "+x+"px;top: "+y+"px;");
        //console.log(element.getBoundingClientRect().left, element.getBoundingClientRect().top, "LAST"); 
    });   
}


function deleteHints() {
    move = 0;
    shown = 0;
    let container = document.querySelector(".introjs-hints");
    if (container)
        while (container.firstChild)
            container.removeChild(container.firstChild);
}

function validateSettings() {
    if (document.forms["settingsForm"]["set_name"].value == "") {
        $("#errIme").text("Polje je obvezno!").parent().addClass("is-invalid");
        return false;
    }
    if (document.forms["settingsForm"]["set_password"].value != document.forms["settingsForm"]["set_password_confirm"].value) {
        $("#errPass2").parent().addClass("is-invalid");
        return false;
    }
    if (document.forms["settingsForm"]["set_phone"].value == "") {  
        $("#errTel").text("Polje je obvezno!").parent().addClass("is-invalid");
        return false;
    }
}
