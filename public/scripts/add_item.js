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
