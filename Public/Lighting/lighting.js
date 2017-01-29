var map;

// ---------------------putlightdatapoint() function----------------------------


function putlightdatapoint(latitude,longitude) {

    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        icon:customMarker,
        map: map
    });
}

// ------------------------------Making Map-------------------------------------


function initMap() {
  window.customMarker = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'yellow',
      fillOpacity: 0.8,
      scale: 5,
      strokeWeight: .1
  };

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 54.7732, lng: -1.5764},
        zoom: 15,
        mapTypeId:'roadmap',
          styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    });

// ---------------------Geolocation & directions--------------------------------

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        start = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        var destination = {lat:54.7732,lng:-1.5747};
        var request = {
          origin: start,
          destination: destination,
          travelMode: 'WALKING',
        }

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
        directionsService.route(request, function(result, status) {
          if (status == 'OK') {
            directionsDisplay.setDirections(result);
          }
        });
      });
    }


// ----------------------------Event trigger------------------------------------


    google.maps.event.addListener(map, 'idle', function () {
        var topLeft;
        var bottomRight;
        var googleCoords = map.getBounds();
        topLeft = [googleCoords.f.b, googleCoords.b.b];
        bottomRight = [googleCoords.f.f, googleCoords.b.f];

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                var jsonResponse = JSON.parse(httpRequest.responseText);
                for(var i in jsonResponse) {
                    putlightdatapoint(jsonResponse[i].latitude, jsonResponse[i].longitude);
                }
            }
        };

        httpRequest.open('GET', 'http://localhost:3000/api/lighting?t=' + topLeft[0] + '&b=' + bottomRight[0] + "&l=" + topLeft[1] + "&r=" + bottomRight[1], true);
        httpRequest.send();
    });

}
