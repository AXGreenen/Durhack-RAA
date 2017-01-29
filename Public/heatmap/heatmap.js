var map;
var heatmap;
var hmdata;

function putlightdatapoint(latitude, longitude) {
    hmdata.push(new google.maps.LatLng(latitude, longitude));
}

function initMap() {
    hmdata = [];

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 54.7732, lng: -1.5764},
        zoom: 15,
        mapTypeId: 'roadmap',
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
                stylers: [{color: '#7C8387'}]//38414e
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
                elementType: 'geometry.fill',
                stylers: [{color: '#572222'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#6D5151'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#3C1717'}]
              }
            ]

    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        //data: null,
        map: map,
        radius: 15,
    	gradient: [
    		'rgba(255,255,0,0)',
    		'rgba(255,255,0,1)',
    		'rgba(255,255,0,1)',
    		'rgba(255,255,0,1)',
    		'rgba(255,255,0,1)',
    		'rgba(255,255,0,1)',
    		'rgba(255,255,0,1)',
    		'rgba(255,255,0,1)',
    		'rgba(255,191,0,1)'
    	]
    });

    var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);

    if (navigator.geolocation) {

      var destination;
      var destinationPostalCode =  window.prompt('Destination Postal Code');
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': destinationPostalCode}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          destination =results[0].geometry.location;
        }
      });

      navigator.geolocation.getCurrentPosition(function(position) {
        start = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
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

    google.maps.event.addListener(map, 'idle', function () {
        var topLeft;
        var bottomRight;
        var googleCoords = map.getBounds();
        topLeft = [googleCoords.f.b, googleCoords.b.b];
        bottomRight = [googleCoords.f.f, googleCoords.b.f];

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {
            hmdata = [];
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                console.log(httpRequest.status);
                var jsonResponse = JSON.parse(httpRequest.responseText);
                for (var i in jsonResponse) {
                    putlightdatapoint(parseFloat(jsonResponse[i].latitude), parseFloat(jsonResponse[i].longitude));
                }
                heatmap.set('data', hmdata);
            }
        };

        httpRequest.open('GET', 'http://localhost:3000/api/lighting?t=' + topLeft[0] + '&b=' + bottomRight[0] + "&l=" + topLeft[1] + "&r=" + bottomRight[1], true);
        httpRequest.send();
    });
}
