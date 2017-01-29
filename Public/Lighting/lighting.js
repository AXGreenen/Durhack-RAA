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


    google.maps.event.addListener(map, 'idle', function () {
        var topLeft;
        var bottomRight;
        var googleCoords = map.getBounds();
        topLeft = [googleCoords.f.b, googleCoords.b.b];
        bottomRight = [googleCoords.f.f, googleCoords.b.f];

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                console.log(httpRequest.status);
                var jsonResponse = JSON.parse(httpRequest.responseText);
                for(var i in jsonResponse) {
                    putlightdatapoint(parseFloat(jsonResponse[i].latitude), parseFloat(jsonResponse[i].longitude));
                }
            }
        };

        httpRequest.open('GET', 'http://localhost:3000/api/lighting?t=' + topLeft[0] + '&b=' + bottomRight[0] + "&l=" + topLeft[1] + "&r=" + bottomRight[1], true);
        httpRequest.send();
    });



}

