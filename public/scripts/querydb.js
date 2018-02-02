jQuery(function($) {
    var items;
    var perPage = 4;
    // This time we'll hold onto the created paginator so we can use it again later.
    var $paginator = $("#pagination");
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
        items = $(".mdl-card-search");
        $paginator.pagination("updateItems", items.length);
        let page = Math.min(
            $paginator.pagination("getCurrentPage"),
            $paginator.pagination("getPagesCount")
        );
        $paginator.pagination("selectPage", page);
    }
    updateItems();

    $("#filter").click(function() {
        let post_data = {};
        if ($("input[name='osebaSearch']").val() != "") post_data = {oseba: $("input[name='osebaSearch']").val()};
        if ($('#statusSearch').val() != "") post_data = {status: $('#statusSearch').val()};
        if ($("input[name='kategorijaSearch']").val() != "") post_data = {kategorija: $("input[name='kategorijaSearch']").val()};
        if ($("input[name='avtorSearch']")  .val() != "") post_data = {avtor : $("input[name='avtorSearch']").val()};
        if ($('#koledarSearch').val() != "") post_data = {koledar : $('#koledarSearch').val()};
        if ($('#ciljSearch').val() != "") post_data = {cilj : $('#ciljSearch').val()};

        var data = {
            action: '/prikazi_naloge',
            data: JSON.parse(JSON.stringify(post_data))
        };

        $.ajax({
            url: '/prikazi_naloge',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                if($(".pagination-container").html(response.content)){
                    $('.pagination-nav').html(response.navigation);
                }
            }
        });
        /*
        $("#content tbody").append("<tr><td>" + items.length + "</td>" +
            "<td>" + items.length + "</td></tr>");*/
        updateItems();
    });
});

/*
$(document).ready(function(){
    $('#dodaj').bind('click', function(){
         $('#cilji').append('<li class="mdl-list__item mdl-list__item--two-line">' +
                                '<div class="circle-container-main mdl-color--grey"></div>' +
                                '<span class="mdl-list__item-primary-content">' +
                                    '<span class="mdl-color-text--black">Moški večer</span>' +
                                    '<span class="mdl-list__item-sub-title mdl-color-text--grey">moški del družine (Janez, Jan, Janko)</span>' +
                                '</span>' +
                                '<span class="mdl-list__item-secondary-content">' +
                                    '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-10">' +
                                        '<input type="checkbox" class="mdl-checkbox__input" id="checkbox-10" checked="checked"/>' +
                                    '</label>' +
                                '</span>' +
                            '</li>');
    });
});
*/