setTimeout(function () {
    app = app || {};

    var ViewModel = function (locations) {
        this.locations = locations;
        this.showMarker = function (location) {
            google.maps.event.trigger(location.marker, 'click');
        }
    }
    ko.applyBindings(new ViewModel(app.locations));
}, 2000)