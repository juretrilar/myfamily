jQuery(function($) {
    let items;
    let perPage = 8;

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
                    $('#imeDialog').val(card.getElementsByClassName("mdl-list__item-text-body")[0].previousElementSibling.innerHTML)
                        .parent().addClass("is-dirty");
                    $('#opisDialog').val(card.getElementsByClassName("mdl-list__item-text-body")[0].innerHTML)
                        .parent().addClass("is-dirty");
                    $('#targetZacetek').val("1/1/2018")
                        .parent().addClass("is-dirty");
                    $('#targetKonec').val("1/1/2018")
                        .parent().addClass("is-dirty");
                    $('#vezanCilj').val("<%= card.konec %>")
                        .parent().addClass("is-dirty");
                    let kat = card.getElementsByClassName("kategorijaNaloga")[0].value;
                    $('#kategorija').get(0).placeholder = $(".list-kategorija").find("[data-val="+kat+"]").get(0).textContent.trim();
                    $("input[name='sampleKategorija']").val(kat)
                        .parent().addClass("is-dirty");
                    let cl = card.getElementsByClassName("ciljNaloga")[0].value;
                    $('#vezanCilj').get(0).placeholder = $(".list-cilj").find("[data-val="+cl+"]").get(0).textContent.trim();
                    $("input[name='sampleCilj']").val(cl)
                        .parent().addClass("is-dirty");
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