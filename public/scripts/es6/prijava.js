$(document).ready(function () {
    setTimeout(function () { //Add method is-dirty if login fields are auto filled
        let pwdInput = $('input[type="password"]:-webkit-autofill');
        let email = $('input[type="email"]:-webkit-autofill');
        pwdInput.parent().addClass('is-dirty');
        email.parent().addClass('is-dirty');
    }, 100);
});

function prikaziRegistracija () { //show registration card
    $("#registracija").show().scrollTop;
    $("#prijava").hide();
}

function prikaziPrijava () { //show login card
    $("#registracija").hide();
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

