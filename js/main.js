setTimeout(function () {
    app = app || {};

    for (i in app.locations) {
        app.current_location += 1;
        var location = app.locations[i];
        var marker = location.marker;
        var infowindow = new google.maps.InfoWindow();
        var map = app.map;
        with ({ place_name: location.place_name }) {
            google.maps.event.addListener(marker, 'click', function () {
                map.setCenter(marker.getPosition());
                infowindow.setContent(place_name);
                infowindow.open(map, this);
            });
        }
    }

    var ViewModel = function (locations) {
        self = this;
        this.locations = ko.observableArray(locations);
        this.showMarker = function (location) {
            google.maps.event.trigger(location.marker, 'click');
        }
        this.filter = function() {
            self.locations.removeAll();
            var filter = $('#filter');
            
        }
    }
    ko.applyBindings(new ViewModel(app.locations));
}, 1000)