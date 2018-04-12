jQuery(function($) {
    let items;
    let perPage = 8;

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

    let $paginator = $("#pagination");
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
            console.log(pageWidth);
            items.hide()
                .slice(showFrom, showTo).show();
        }
    });

    function updateItems() {
        items = $(".paginate");
        $paginator.pagination("updateItems", items.length);
        let page = Math.min(
            $paginator.pagination("getCurrentPage"),
            $paginator.pagination("getPagesCount")
        );
        $paginator.pagination("selectPage", page);
    }

    $("#filter").click(function() {
        let post_data = {};
        if ($("input[name='osebaSearch']").val() != "") post_data.oseba = $("input[name='osebaSearch']").val();
        if ($('#statusSearch').val() != "") post_data.status = $("input[name='statusSearch']").val();
        if ($("input[name='kategorijaSearch']").val() != "") post_data.kategorija = $("input[name='kategorijaSearch']").val();
        if ($("input[name='avtorSearch']")  .val() != "") post_data.avtor = $("input[name='avtorSearch']").val();
        if ($('#koledarSearch').val() != "") post_data.koledar = $('#koledarSearch').val();
        if ($('#ciljSearch').val() != "") post_data.cilj =  $('#ciljSearch').val();

        /*
        let data = {
            action: '/prikazi_naloge',
            data: JSON.parse(JSON.stringify(post_data))
        }; */
        $.ajax({
            url: '/prikazi_naloge',
            type: 'POST',
            //contentType: 'application/json',
            data: post_data,
            success: function (response) {
                console.log(response);
                $('#nalogeGrid').html(response);
                updateItems();
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
                } onCardClick("nalogeGrid", function (card, event) {
                    posodobiNalogo();
                    //
                    $('#newDialog').val(card.getElementsByClassName("idNaloga")[0].value);
                    $('#imeDialog').val(card.getElementsByClassName("mdl-list__item-text-body")[0].previousElementSibling.innerHTML)
                        .parent().addClass("is-dirty");
                    $('#opisDialog').val(card.getElementsByClassName("mdl-list__item-text-body")[0].innerHTML)
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
                            console.log(usr);
                            curr.check();
                            u++;
                            if(u => usr.length) break;
                        }
                    }

                    event.stopPropagation();
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(xhr.responseText);
                alert(thrownError)
            }
        });
        console.log("updating items");
        updateItems();
    });

    $("#reset").click(function() {
        //document.getElementById("searchFilter").reset();
        console.log("form reseted");
        getmdlSelect.init(".mdl-filter");
        $( ".selected" ).removeClass("selected");
        $("input[name='osebaSearch']").val("").parent().removeClass("is-dirty");
        $('#statusSearch').val("").parent().removeClass("is-dirty");
        $("input[name='kategorijaSearch']").val("").parent().removeClass("is-dirty");
        $("input[name='avtorSearch']").val("").parent().removeClass("is-dirty");
        $('#koledarSearch').val("").parent().removeClass("is-dirty");
        $('#ciljSearch').val("").parent().removeClass("is-dirty");
    });

});

function clearField(i, chip) {
    getmdlSelect.init(".mdl-filter"+i);
    let elm = document.getElementsByClassName("mdl-filter"+i)[0];
    elm.classList.remove("is-dirty");
    chip.style.display = 'none'
}

function objaviStatus() {
    let curr = $("#trenutniUporabnik").val();
    let query = "#status"+curr;    
    $(query).html($("#currStatus").val());
    if($("#currStatus").val() != "") {
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
    }
}