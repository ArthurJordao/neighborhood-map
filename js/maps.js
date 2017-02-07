var app = app || {};

function initialize() {
    var pyrmont = new google.maps.LatLng(-33.8665, 151.1956);
    app.center = pyrmont;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15,
        scrollwheel: false
    });
    app.map = map;
    initModel();
}
