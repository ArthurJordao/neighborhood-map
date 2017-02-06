setTimeout(function () {
    app = app || {};

    //This function put a content in the map window
    function fillWindow(place_name, marker) {
        var content_obj = { content: '<h3>' + place_name + '</h3>' };
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
                content_obj.content = content_obj.content.concat('<h4>Wikipedia links</h4>');
                if (articleList.length == 0) {
                    content_obj.content = content_obj.content.concat('<p>No links for this location</p>');
                }
                content_obj.content = content_obj.content.concat('<ul>');
                for (var i = 0; i < articleList.length; i++) {
                    articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    content_obj.content = content_obj.content.concat('<li><a href="' + url + '">' +
                        articleStr + '</a></li>');
                };
                content_obj.content = content_obj.content.concat('</ul>');
                $('.marker-content').html(content_obj.content);
            }).fail(function () {
                content_obj.content += '<h4>we cannot get the wiki links</h4>';
                $('.marker-content').html(content_obj.content);
            });
            var position = marker.getPosition();
            var urlMapsImagem = 'https://maps.googleapis.com/maps/api/streetview?' + $.param({
                size: '300x150',
                location: marker.getPosition().lat() + ',' + marker.getPosition().lng(),
                heading: 100,
                pitch: 28,
                scale: 2,
                key: 'AIzaSyBQdWmtjN4I8ev6zMPJU7oTx_x6aInPifw'
            })
              $(document).ajaxStop(function () {
                $('.marker-img').html('<img src="' + urlMapsImagem + '" alt="Photo of"' + place_name + '>');
            });
        }
    }
    // add a listener to the markers and put a link to them in the side bar
    for (i in app.locations) {
        app.current_location += 1;
        var location = app.locations[i];
        var marker = location.marker;
        var infowindow = new google.maps.InfoWindow();
        var map = app.map;
        with ({ place_name: location.place_name, marker: marker }) {
            google.maps.event.addListener(marker, 'click', function () {
                map.setCenter(marker.getPosition());
                infowindow.open(map, this);
                $('.marker-content').html('');
                infowindow.setContent('<div class="marker-content"></div><div class="marker-img"></div>');
                fillWindow(place_name, marker);
                if (app.current_animated) {
                    app.current_animated.setAnimation(null);
                }
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    app.current_animated = marker;
                }
            });
        }
    }

    // this ViewModel provide a list of locations and some functions
    var ViewModel = function (locations) {
        self = this;
        this.locations = ko.observableArray([].concat(locations));
        this.showMarker = function (location) {
            google.maps.event.trigger(location.marker, 'click');
        }
        this.filter = function () {
            self.locations.removeAll();
            var filter = $('#filter').val();
            if (!filter) {
                for (i in app.locations) {
                    var location = app.locations[i];
                    location.marker.setVisible(true);
                    self.locations.push(location);
                }
            } else {
                var filter_reg = new RegExp(filter, 'gi');
                for (i in app.locations) {
                    var location = app.locations[i];
                    if (location.place_name.match(filter_reg)) {
                        location.marker.setVisible(true);
                        self.locations.push(location);
                    } else {
                        location.marker.setVisible(false);
                    }
                }
            }
        }
    }
    ko.applyBindings(new ViewModel(app.locations));
}, 2000) //wait map load