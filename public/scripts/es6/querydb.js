let $paginator;
let items;

jQuery(function($) {
    let perPage = 24;

    $('#osebaSearch').get(0).onchange = function() {
        $("#chipOseba").attr('style',"display: inline-block;").find("span:first-child").text($(this).val()); // get the current value of the input field.
    };
    $('#statusSearch').get(0).onchange = function() {
        $("#chipStatus").attr('style',"display: inline-block;").find("span:first-child").text($(this).val()); // get the current value of the input field.
    };
    $('#kategorijaSearch').get(0).onchange = function() {
        $("#chipKategorija").attr('style',"display: inline-block;").find("span:first-child").text($(this).val()); // get the current value of the input field.
    };
    $('#avtorSearch').get(0).onchange = function() {
        $("#chipAvtor").attr('style',"display: inline-block;").find("span:first-child").text($(this).val()); // get the current value of the input field.
    };
    $('#koledarSearch').get(0).onchange = function() {
        $("#chipKoledar").attr('style',"display: inline-block;").find("span:first-child").text($(this).val()); // get the current value of the input field.
    };
    $('#ciljSearch').get(0).onchange = function() {
        $("#chipCilj").attr('style',"display: inline-block;").find("span:first-child").text($(this).val()); // get the current value of the input field.
    };

    $paginator = $("#pagination");
    $paginator.pagination({
        itemsOnPage: perPage,
        cssStyle: "light-theme",
        onPageClick: function(pageNumber) {
            let pageWidth = $(document).width();
            var showFrom = perPage * (pageNumber - 1);
            var showTo = showFrom + perPage;
            $(".naloge-center").attr('style',"display: none!important");
            for(let i = showFrom;i<=showTo;i++) {
                if (pageWidth > 1440) {
                    $("#cellHa"+i).attr('style',"display: block!important");
                    $("#cellHb"+i).attr('style',"display: block!important");
                } else if (pageWidth > 840) {
                    $("#cellPa"+i).attr('style',"display: block!important");
                    $("#cellPb"+i).attr('style',"display: block!important");
                }
            }
            //console.log(pageWidth);
            items.hide()
                .slice(showFrom, showTo).show();
        }
    });

    $("#filter").click(function() {
        queryNaloge();
    });

    $("#reset").click(function() {
        //document.getElementById("searchFilter").reset();
        //console.log("form reseted");
        getmdlSelect.init(".mdl-filter");
        $( ".selected" ).removeClass("selected");
        $("input[name='osebaSearch']").val("").parent().removeClass("is-dirty");
        $('#statusSearch').val("").parent().removeClass("is-dirty");
        $("input[name='kategorijaSearch']").val("").parent().removeClass("is-dirty");
        $("input[name='avtorSearch']").val("").parent().removeClass("is-dirty");
        $('#koledarSearch').val("").parent().removeClass("is-dirty");
        $('#ciljSearch').val("").parent().removeClass("is-dirty");
    });

    queryNaloge();   
    $("#menuDashboard").addClass("is-active");
    $("#dashboard").addClass("is-active");
    /* 
    if ($( "#menuNaloge" ).hasClass( "is-active" )) {

    }    
    $("#menuNaloge").removeClass("is-active");
    $("#naloge").removeClass("is-active");*/
    
});

function clearField(i, chip) {
    getmdlSelect.init(".mdl-filter"+i);
    let elm = document.getElementsByClassName("mdl-filter"+i)[0];
    elm.classList.remove("is-dirty");
    chip.style.display = 'none'
}

function objaviStatus() {
    let curr = $("#trenutniUporabnik").val();
    if($("#currStatus").val() != "") {
        $("#status"+curr).text($("#currStatus").val()).parent().removeClass("hide-element");
        let save = {"currStatus": $("#currStatus").val()};
        $.ajax({
            url: '/status',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(save),
            success: function(){
                $("#currStatus").val("");
                let data = {message: "Status je bil uspešno posodobljen!"};
                let snackbarContainer = document.querySelector('#mainToast');            
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            },
            error: function( jqXhr, textStatus, errorThrown){
                let data = {message: "Prišlo je do napake, status ni bil shranjen!"};                
                let snackbarContainer = document.querySelector('#mainToast');             
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            }
            
        });
    } else {
        $("#status"+curr).parent.addClass("hide-element");
    }
}

function updateItems() {
    items = $(".paginate");
    $paginator.pagination("updateItems", items.length);
    let page = Math.min(
        $paginator.pagination("getCurrentPage"),
        $paginator.pagination("getPagesCount")
    );
    $paginator.pagination("selectPage", page);
    if (items.length > 24) $("#pagination").attr("style", "display: list-view")
}

function queryNaloge() {
    let post_data = {};
    if ($("input[name='osebaSearch']").val() != "") post_data.oseba = $("input[name='osebaSearch']").val();
    if ($("input[name='statusSearch']").val() != "") post_data.status = $("input[name='statusSearch']").val();
    if ($("input[name='kategorijaSearch']").val() != "") post_data.kategorija = $("input[name='kategorijaSearch']").val();
    if ($("input[name='avtorSearch']")  .val() != "") post_data.avtor = $("input[name='avtorSearch']").val();
    if ($("input[name='koledarSearch']").val() != "") post_data.koledar = $('#koledarSearch').val();
    if ($("input[name='ciljSearch']").val() != "") post_data.cilj =  $("#input[name='ciljSearch']").val();

    $.ajax({
        url: '/prikazi_naloge',
        type: 'POST',
        //contentType: 'application/json',
        data: post_data,
        success: function (response, xhr) {
            console.log(response.length);
            if (response.includes("<!doctype html>")) {
                window.location.reload();
            } else if(response.length == 0) {
                console.log(response, xhr);
                let data = {message: "Nobena naloga ne ustreza iskalnim parametrom!"};
                let snackbarContainer = document.querySelector('#mainToast');            
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            } else {
                $('#nalogeGrid').html(response);
                updateItems();
                function onCardClick(cardId, callback) {
                    let parent = document.getElementById("nalogeGrid"),
                        card = parent.getElementsByClassName("mdl-card"),i;
                    for (i = 0; i < card.length; i++) {
                        card[i].getElementsByTagName('button')[0].onclick = function (card) {
                            return function () {
                                callback(card, event);
                            };
                        }(card[i]);
                    }
                } onCardClick("nalogeGrid", function (card, event) {
                    currentElement = card;
                    posodobiNalogo();
                    //
                    $('#newDialog').val(card.getElementsByClassName("idNaloga")[0].value);
                    $('#imeDialog').val(card.getElementsByClassName("queryIme")[0].innerHTML)
                        .parent().addClass("is-dirty");
                    $('#opisDialog').val(card.getElementsByClassName("queryOpis")[0].innerHTML)
                        .parent().addClass("is-dirty");
                    let dateZ,dateK;
                    try {
                         dateZ = card.getElementsByClassName("dateNaloga")[0].innerHTML;
                         dateK = card.getElementsByClassName("dateNaloga")[1].innerHTML;
                    } catch(err) {
                        console.log(err);
                    }
                    if (dateZ) {
                        $('#targetZacetek').val(dateZ).parent().addClass("is-dirty");
                        $('#dateZacetek').val(moment(dateZ.replace(' ob ',' '), 'DD-MM-Y HH:mm').format('Y-MM-DD HH:mm'));
                    }
                    if (dateK) {
                        $('#targetKonec') .val(dateK).parent().addClass("is-dirty");
                        $('#dateKonec').val(moment(dateK.replace(' ob ',' '), 'DD-MM-Y HH:mm').format('Y-MM-DD HH:mm'));
                    }
                    let kat = card.getElementsByClassName("kategorijaNaloga")[0].value;
                    $('#kategorija').get(0).placeholder = $(".list-kategorija").find("[data-val="+kat+"]").get(0).textContent.trim();
                    $("input[name='sampleKategorija']").parent().addClass("is-dirty").find("li[data-val="+kat+"]").attr('data-selected','true');
                    getmdlSelect.init("#dialogKategorija");
                    let cl = card.getElementsByClassName("ciljNaloga")[0].value;
                    $('#vezanCilj').get(0).placeholder = $(".list-cilj").find("[data-val="+cl+"]").get(0).textContent.trim();
                    $("input[name='sampleCilj']").parent().addClass("is-dirty").find("li[data-val="+cl+"]").attr('data-selected','true');
                    $("input[name='oldCilj']").val(cl);
                    getmdlSelect.init("#dialogCilj");
                    let status = card.getElementsByClassName("statusNaloga")[0].innerHTML;
                    $('#statusNaloge').get(0).placeholder = status;
                    if(status == "Neopravljena") {
                        $("#statusNaloge").parent().addClass("is-dirty")
                            .find("li[data-val=false]").attr('data-selected','true');
                        $("input[name='oldStatus']").val("false");
                        $("input[name='newStatus']").val("false");
                    } else {
                        $("#statusNaloge").parent().addClass("is-dirty")
                            .find("li[data-val=true]").attr('data-selected','true');
                        $("input[name='oldStatus']").val("true");
                        $("input[name='newStatus']").val("true");
                    }
                    getmdlSelect.init("#dialogStatus");
                    $('#xpNaloge').val(card.getElementsByClassName("xpNaloga")[0].innerHTML.match(/\d/g).join("")).parent().addClass("is-dirty");
                    let usr = card.getElementsByClassName("udelezenecNaloga");
                    let chckbox = $("input:checkbox[name='person']");
                    $("#checkboxVsi").parent()[0].MaterialCheckbox.uncheck();
                    if(chckbox.length-1==usr.length) {
                        $("#checkboxVsi").parent()[0].MaterialCheckbox.check();
                    }
                    let u=0;
                    for(let i=1;i<chckbox.length;i++) {
                        let curr = $("#"+chckbox[i].id).parent()[0].MaterialCheckbox;
                        curr.uncheck();
                        if(usr[u].value == chckbox[i].value) {
                            //console.log(usr);
                            curr.check();
                            u++;
                            if(u => usr.length) break;
                        }
                    }
    
                    event.stopPropagation();
                });
            }            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status,xhr.responseText,thrownError);
            let data = {message: "Med nalaganjem nalog je prišlo do napake!"};
            let snackbarContainer = document.querySelector('#mainToast');            
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
    });
    updateItems();
}
