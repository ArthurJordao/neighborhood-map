setTimeout(function () {
    app = app || {};

    function fillWindow(place_name) {
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
        }
    }

    for (i in app.locations) {
        app.current_location += 1;
        var location = app.locations[i];
        var marker = location.marker;
        var infowindow = new google.maps.InfoWindow();
        var map = app.map;
        with ({ place_name: location.place_name }) {
            google.maps.event.addListener(marker, 'click', function () {
                $('.marker-content').html('');
                map.setCenter(marker.getPosition());
                infowindow.setContent('<div class="marker-content"></div>');
                infowindow.open(map, this);
                fillWindow(place_name)
            });
        }
    }

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
}, 1000)