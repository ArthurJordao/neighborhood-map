var app = app || {};

function initialize() {
  var pyrmont = new google.maps.LatLng(-33.8665, 151.1956);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15,
    scrollwheel: true
  });

  app.map = map;

  // Specify location, radius and place types for your Places API search.
  var request = {
    location: pyrmont,
    radius: '5000',
    types: ['park', 'bar', 'store']
  };

  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function (results, status) {
    app.locations = [];
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        // If the request succeeds, draw the place location on
        // the map as a marker, and register an event to handle a
        // click on the marker.
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        
        app.locations.push({
          marker: marker,
          place_name: place.name
        });
      }
    }
  });
}
