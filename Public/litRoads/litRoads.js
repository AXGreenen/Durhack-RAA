var map;

function putlightdatapoint(latitude,longitude) {
    // var lightingicon = 'url_of_the_lighting_image'
    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        map: map
        //type:lighting
    });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 54.7732, lng: -1.5764},
        zoom: 15,
        mapTypeId:'roadmap'
    });


    var snappedCoordinates = [];
    var polylines = [];

    // Snap a user-created polyline to roads and draw the snapped path
    function runSnapToRoad(path) {
        $.get('https://roads.googleapis.com/v1/snapToRoads', {
            interpolate: true,
            key: "AIzaSyCvavlLGdC4-ZV8FkmEun2wFI8zA8XHWwY",
            path: path.join('|')
        }, function(data) {
            processSnapToRoadResponse(data);
            drawSnappedPolyline();
        });
    }

// Store snapped polyline returned by the snap-to-road service.
    function processSnapToRoadResponse(data) {
        snappedCoordinates = [];
        if(data.snappedPoints.length > 2) {
            for (var i = 0; i < data.snappedPoints.length; i++) {
                var latlng = new google.maps.LatLng(
                    data.snappedPoints[i].location.latitude,
                    data.snappedPoints[i].location.longitude);
                snappedCoordinates.push(latlng);
            }
        }
    }

// Draws the snapped polyline (after processing snap-to-road response).
    function drawSnappedPolyline() {
        var snappedPolyline = new google.maps.Polyline({
            path: snappedCoordinates,
            strokeColor: 'black',
            strokeWeight: 3
        });

        snappedPolyline.setMap(map);
        polylines.push(snappedPolyline);
    }

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
                var tempPoints = [];
                var j = 0;
                var previousPoint = jsonResponse[0];
                while(j < jsonResponse.length) {
                    /*console.log(Math.abs(previousPoint.latitude - jsonResponse[j].latitude) < 0.01);
                    console.log(Math.abs(previousPoint.longitude - jsonResponse[j].longitude) < 0.01);
                    previousPoint = jsonResponse[j];
                    j++;*/


                    if(tempPoints.length < 100) {
                        if(Math.abs(previousPoint.latitude - jsonResponse[j].latitude) < 0.0005 && Math.abs(previousPoint.longitude - jsonResponse[j].longitude) < 0.0005) {
                            tempPoints.push(jsonResponse[j].latitude + "," + jsonResponse[j].longitude);
                        }
                        else if(tempPoints.length > 3) {
                            runSnapToRoad(tempPoints);
                            tempPoints = [];
                        }
                    }
                    else {
                        runSnapToRoad(tempPoints);
                        tempPoints = [];
                    }
                    previousPoint = jsonResponse[j];
                    j++
                }
            }
        };

        httpRequest.open('GET', 'http://localhost:3000/api/lighting?t=' + topLeft[0] + '&b=' + bottomRight[0] + "&l=" + topLeft[1] + "&r=" + bottomRight[1], true);
        httpRequest.send();
    });



}

