function initModel() {
    // Specify location, radius and place types for your Places API search.
    var request = {
        location: app.center,
        radius: '5000',
        types: ['park', 'bar', 'store']
    };

    // Create the PlaceService and send the request.
    // Handle the callback with an anonymous function.
    var service = new google.maps.places.PlacesService(app.map);
    service.nearbySearch(request, function (results, status) {
        app.locations = [];
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                // If the request succeeds, draw the place location on
                // the map as a marker, and register an event to handle a
                // click on the marker.
                var marker = new google.maps.Marker({
                    map: app.map,
                    position: place.geometry.location
                });
                marker.setAnimation(null);

                app.locations.push({
                    marker: marker,
                    place_name: place.name
                });
            }
            addMarkerEvent();
        }
        else {
            var div = $('<div></div>').text('Cannot get nearby places');
            $('#mySidenav').append(div);
            startView();
        }
    });
}

//This function put a content in the map window
function fillWindow(place_name, marker, infowindow) {
    infowindow.setContent('<h3>' + place_name + '</h3>');
    var wikiURL = "https://en.wikipedia.org/w/api.php";
    wikiURL += '?' + $.param({
        action: "opensearch",
        search: place_name,
        format: 'json',
        callback: 'wikiCallback'
    });
    $.ajax({
        url: wikiURL,
        dataType: 'jsonp'
    }).done(function (response) {
        var articleList = response[1];
        infowindow.setContent(infowindow.getContent() + '<h4>Wikipedia links</h4>');
        if (articleList.length === 0) {
            infowindow.setContent(infowindow.getContent() + '<p>No links for this location</p>');
        }
        infowindow.setContent(infowindow.getContent() + '<ul>');
        for (var i = 0; i < articleList.length; i++) {
            articleStr = articleList[i];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
            infowindow.setContent(infowindow.getContent() + '<li><a href="' + url + '">' +
                articleStr + '</a></li>');
        }
        infowindow.setContent(infowindow.getContent() + '</ul>');
    }).fail(function () {
        infowindow.setContent(infowindow.getContent() + '<h4>we cannot get the wiki links</h4>');
    });
    var position = marker.getPosition();
    var urlMapsImagem = 'https://maps.googleapis.com/maps/api/streetview?' + $.param({
        size: '300x150',
        location: marker.getPosition().lat() + ',' + marker.getPosition().lng(),
        heading: 100,
        pitch: 28,
        scale: 2,
        key: 'AIzaSyBQdWmtjN4I8ev6zMPJU7oTx_x6aInPifw'
    });
    $(document).ajaxStop(function () {
        infowindow.setContent(infowindow.getContent() + '<img src="' + urlMapsImagem + '" alt="Photo of"' + place_name + '>');
    });
}

function addMarkerEvent() {
    // add a listener to the markers and put a link to them in the side bar
    for (var i = 0; i < app.locations.length; i++) {
        app.current_location += 1;
        var location = app.locations[i];
        var marker = location.marker;
        var infowindow = new google.maps.InfoWindow();
        var map = app.map;
        with ({ place_name: location.place_name, marker: marker }) {
            google.maps.event.addListener(marker, 'click', function () {
                map.setCenter(marker.getPosition());
                infowindow.open(map, this);
                fillWindow(place_name, marker, infowindow);
                if (app.current_animated) {
                    app.current_animated.setAnimation(null);
                }
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    with ({ marker: marker }) {
                        app.current_animated = marker;
                        setTimeout(function () {
                            marker.setAnimation(null);
                        }, 2000);
                    }
                }
            });
        }
    }
    startView();
}

function mapLoadError() {
    $('#map').text('map load have a problem').css('color', 'white');
}
