jQuery(function($) {
    let items;
    let perPage = 8;

    let $paginator = $("#pagination");
    $paginator.pagination({
        itemsOnPage: perPage,
        cssStyle: "light-theme",
        onPageClick: function(pageNumber) {
            var showFrom = perPage * (pageNumber - 1);
            var showTo = showFrom + perPage;
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
        console.log(post_data);

        $.ajax({
            url: '/prikazi_naloge',
            type: 'POST',
            //contentType: 'application/json',
            data: post_data,
            success: function (response) {
                $('#nalogeGrid').html(response);
                updateItems();
            }
        });
        console.log("updating items");
        updateItems();
    });

    $("#reset").click(function() {
        //document.getElementById("searchFilter").reset();
        console.log("form reseted");
        getmdlSelect.init(".getmdl-select");
        $( ".selected" ).removeClass("selected");
        $("input[name='osebaSearch']").val("").parent().removeClass("is-dirty");
        $('#statusSearch').val("").parent().removeClass("is-dirty");
        $("input[name='kategorijaSearch']").val("").parent().removeClass("is-dirty");
        $("input[name='avtorSearch']").val("").parent().removeClass("is-dirty");
        $('#koledarSearch').val("").parent().removeClass("is-dirty");
        $('#ciljSearch').val("").parent().removeClass("is-dirty");
    });
});