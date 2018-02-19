$(window).load( function() {
     $('#mycalendar').monthly({
        mode: 'event',
        dataType: 'json',
        jsonUrl: id+"/data/events.json"
    });
    switch(window.location.protocol) {
        case 'http:':
        case 'https:':
            // running on a server, should be good.
            break;
        case 'file:':
            alert('Just a heads-up, events will not work when run locally.');
    }
});

function zapriNalogo() {
    $("#NalogaPopUp").css("display", "none");
}
