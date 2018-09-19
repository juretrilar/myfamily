r(function(){
    if(localStorage.getItem("Status")) {
        let snackbarContainer = document.querySelector('#mainToast');            
        snackbarContainer.MaterialSnackbar.showSnackbar({message: localStorage.getItem("Status")});
        localStorage.removeItem("Status");
    }
});
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}

$(document).ready(function () {
    setTimeout(function () { //Add method is-dirty if login fields are auto filled
        let pwdInput = $('input[type="password"]:-webkit-autofill');
        let email = $('input[type="email"]:-webkit-autofill');
        pwdInput.parent().addClass('is-dirty');
        email.parent().addClass('is-dirty');
    }, 100);
});

let intro = introJs();

function prikaziRegistracija () { //show registration card
    $("#prijava").hide();
    $("#lostPass").hide();
    $("#registracija").show().scrollTop;
    intro.hideHints();    
}

function prikaziPass () { //show registration card
    $("#prijava").hide();
    $("#registracija").hide();
    $("#lostPass").show().scrollTop;
    intro.hideHints();
    
}

function prikaziPrijava () { //show login card
    $("#lostPass").hide();
    $("#registracija").hide();
    intro.hideHints();
    $("#prijava").show().scrollTop;
}

function isImage(file) {
    return file['type'].split('/')[0] == 'image'; //returns true if image
}

function validateRegistracija() {
    if (document.forms["registracijaForm"]["reg_name"].value === "") {
        $("#errIme").text("Polje je obvezno!").parent().addClass("is-invalid");
        return false;
    }
    if (document.forms["registracijaForm"]["reg_email"].value === "") {
        $("#errEmail").text("Polje je obvezno!").parent().addClass("is-invalid");
        return false;
    }
    if (document.forms["registracijaForm"]["reg_password"].value === "") {
        $("#errPass").text("Polje je obvezno").parent().addClass("is-invalid");
        return false;
    }
    if (document.forms["registracijaForm"]["reg_password"].value != document.forms["registracijaForm"]["reg_password_confirm"].value) {
        $("#errPass2").parent().addClass("is-invalid");
        return false;
    }
    if (document.forms["registracijaForm"]["reg_phone"].value == "") {
        $("#errTel").text("Polje je obvezno!").parent().addClass("is-invalid");
        return false;
    }
    intro.hideHints();
    /*
    if (document.forms["registracijaForm"]["reg_slika_ime"].value != "") {
        
        if (document.forms["registracijaForm"]["reg_slika"].files.length > 0) {
            if (!isImage(document.forms["registracijaForm"]["reg_slika"].files[0])) {
                $("#errSlika").parent().addClass("is-invalid");
                return false;
            }
        } else {
            $("#errSlika").parent().addClass("is-invalid");
            return false;
        }
    } */
    return true;
}

function updatePic(pic) { //update picture name, if action is canceled leave blank
    console.log(pic.files[0]);
    if(pic.files[0]) {
        $('#reg_slika_ime').val(pic.files[0].name)
            .parent().addClass("is-dirty");
    } else {
        $('#reg_slika_ime').val("")
            .parent().removeClass("is-dirty");
    }

}

function addHintsReg() {
      intro.setOptions({
        hintButtonLabel: 'Razumem!',
        hintPosition: 'top-right',
        hints: [
          {
            element: document.querySelector('#reg_name'),
            hint: "V polje vpišite vaše ime in priimek.",
          },
          {
            element: document.querySelector('#reg_email'),
            hint: "V to polje vpišite vaš elektronski naslov, ki ga boste uporabljali za prijavo v aplikacijo in nanj prejemali obvestila.",
          },
          {
            element: '#reg_password',
            hint: 'V to polje vpišite geslo, ki naj bo dolgo vsaj 6 znakov. Geslo mora vsebovati vsaj eno veliko črko in številko.',
          },
          {
            element: '#reg_password_confirm',
            hint: 'Ponovno vpišite izbrano geslo.',
          },
          {
            element: '#reg_phone',
            hint: "V to polje vpišite vašo telefonsko številko, na katero boste prejemali sms sporočila.",
          },
          {
            element: '#avatars',
            hint: "Izberite si prikazno sliko v aplikaciji. Če slike ne izberete, vam bo določena s strani aplikacije.",
          },
        ]
    });
    intro.onhintsadded(function() {
        console.log('all hints added');
    });
    intro.onhintclick(function(hintElement, item, stepId) {
        console.log('hint clicked', hintElement, item, stepId);
    });
    intro.onhintclose(function (stepId) {
        console.log('hint closed', stepId);
    });
    intro.addHints();
}

function introPrijava(){
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
            intro:"Pozdravljeni v aplikaciji MyFamily, v primeru težav pri uporabi aplikacije, pošljite elektronsko sporočilo na naslov vid.cermelj@ltfe.org ali veronika.zavratnik@ltfe.org.",
        },
        {
            intro: 'Če še niste registrirani, lahko to storite s klikom na gumb Registrirajte se.',
        },
        ]
    });
    intro.start();
}


function chooseHelp() {
    introPrijava();
}


function validatePrijava() {
    if (document.forms["prijavaForm"]["email"].value == "") {
        $("#emailErr").text("Vpišite uporabniško ime!").parent().addClass("is-invalid");
        return false;
    }
    if (document.forms["prijavaForm"]["password"].value == "") {
        $("#passErr").text("Vpišite geslo!").parent().addClass("is-invalid");
        return false;
    }    
}

function validatePassword() {
    if (document.forms["passForm"]["email"].value == "") {
        $("#emailErr").text("Prosimo vpišite vaš e-mail naslov!").parent().addClass("is-invalid");
        return false;
    }
}


function validateChange() {
    if (document.forms["changeForm"]["password"].value == "") {
        $("#errChange").text("Polje je obvezno").parent().addClass("is-invalid");
        return false;
    }
    if (document.forms["changeForm"]["password"].value != document.forms["changeForm"]["password_confirm"].value) {
        $("#errChange").parent().addClass("is-invalid");
        return false;
    }
}

function checkMail(email) {
    let testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    if (testEmail.test(email.value)) {
        email.setCustomValidity('');
        email.parentElement.classList.remove("is-invalid");
    // Do whatever if it passes.
    } else {
        // input is fine -- reset the error message
        $("#emailErr").text("Vpisani email ni pravilen!");
        $("#passErr").parent().removeClass("is-invalid");
        email.setCustomValidity('Prosimo vključite '+"'@'"+'in '+"'.'"+' v email naslov!');
   }
}


$('#registracijaForm').submit(function(){
    if (validateRegistracija()===true) {
        $.ajax({
            url: $('#registracijaForm').attr('action'),
            type: 'POST',
            data : $('#registracijaForm').serialize(),
            success: function(){
                window.location.reload(true);
            },
            error: function(response, jqXhr, textStatus, errorThrown){  
                console.log(response);          
                $("#errEmail").text(response.responseText).parent().addClass("is-invalid");
            }
        });
    }
    return false;
});

$('#changeForm').submit(function(){
    $.ajax({
        url: "/api/confirm?token="+getQueryVariable("token"),
        type: 'POST',
        data : $('#changeForm').serialize(),
        success: function(response){
            localStorage.setItem("Status", "Geslo je bilo uspešno spremenjeno!");
            window.location.reload(true);
        },
        error: function(response){ 
            localStorage.setItem("Status",response);
            let clean_uri = location.protocol + "//" + location.host;
            window.history.replaceState({}, document.title, clean_uri);
            window.location.reload(true);                   
        }
    });
    return false;
});


$('#passForm').submit(function(){
    $.ajax({
        url: $('#passForm').attr('action'),
        type: 'POST',
        data : $('#passForm').serialize(),
        success: function(response){
            localStorage.setItem("Status", response);
            window.location.reload(true);
        },
        error: function(response){      
            $("#emailResetErr").text(response.responseText).parent().addClass("is-invalid");
        }
    });
    return false;
});

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}


function pregled() {
    let clean_uri = location.protocol + "//" + location.host;
    window.history.replaceState({}, document.title, clean_uri);
    window.location.reload(true);
}