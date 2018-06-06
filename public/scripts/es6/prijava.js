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
    $("#registracija").show().scrollTop;
    intro.hideHints();
    $("#prijava").hide();
}

function prikaziPrijava () { //show login card
    $("#registracija").hide();
    intro.hideHints();
    $("#prijava").show().scrollTop;
}

function isImage(file) {
    return file['type'].split('/')[0] == 'image'; //returns true if image
}

function validateRegistracija() {
    if (document.forms["registracijaForm"]["reg_name"].value == "") {
        $("#errIme").text("Polje je obvezno!").parent().addClass("is-invalid");
        return false;
    }
    if (document.forms["registracijaForm"]["reg_email"].value == "") {
        $("#errEmail").text("Polje je obvezno!").parent().addClass("is-invalid");
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

