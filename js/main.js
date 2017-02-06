setTimeout(function () {
    app = app || {};

    function content(place_name) {
        var content_obj = {content: '<h3>' + place_name + '</h3>'};
        var wikiURL = "https://en.wikipedia.org/w/api.php";
        wikiURL += '?' + $.param({
            action: "opensearch",
            search: place_name,
            format: 'json',
            callback: 'wikiCallback'
        });
        with ({ content_obj: content_obj }) {
            $.ajax({
                url: wikiURL,
                dataType: 'jsonp'
            }).done(function (response) {
                var articleList = response[1];
                for (var i = 0; i < articleList.length; i++) {
                    articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    content_obj.content = content_obj.content.concat('<li><a href="' + url + '">' +
                        articleStr + '</a></li>');
                };
                console.log(content_obj.content);
            }).fail(function(e) {
                console.log(e);
            });
        }
        return content_obj.content;
    }

    for (i in app.locations) {
        app.current_location += 1;
        var location = app.locations[i];
        var marker = location.marker;
        var infowindow = new google.maps.InfoWindow();
        var map = app.map;
        with ({ place_name: location.place_name }) {
            google.maps.event.addListener(marker, 'click', function () {
                map.setCenter(marker.getPosition());
                infowindow.setContent(content(place_name));
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
        this.filter = function () {
            self.locations.removeAll();
            var filter = $('#filter');

        }
    }
    ko.applyBindings(new ViewModel(app.locations));
}, 1000)