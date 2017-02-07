function startView() {
    app = app || {};

    // this ViewModel provide a list of locations and some functions
    var ViewModel = function (locations) {
        self = this;
        this.locations = ko.observableArray([].concat(locations));
        this.showMarker = function (location) {
            google.maps.event.trigger(location.marker, 'click');
        };
        this.filter = function () {
            self.locations.removeAll();
            var filter = $('#filter').val();
            if (!filter) {
                for (var i = 0; i < app.locations.length; i++) {
                    var location = app.locations[i];
                    location.marker.setVisible(true);
                    self.locations.push(location);
                }
            } else {
                var filter_reg = new RegExp(filter, 'gi');
                for (var i = 0; i < app.locations.length; i++) {
                    var location = app.locations[i];
                    if (location.place_name.match(filter_reg)) {
                        location.marker.setVisible(true);
                        self.locations.push(location);
                    } else {
                        location.marker.setVisible(false);
                    }
                }
            }
        };
    };
    ko.applyBindings(new ViewModel(app.locations));
}