var map;

function putlightdatapoint(latitude,longitude) {
    // var lightingicon = 'url_of_the_lighting_image'
    var marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        map: map
        //type:lighting
    });

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 54.7732, lng: -1.5764},
        zoom: 15,
        mapTypeId:'roadmap'
    });
}

httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        console.log(httpRequest.status);
        var jsonResponse = JSON.parse(httpRequest.responseText);
        for(var i in jsonResponse) {
            putlightdatapoint(parseFloat(jsonResponse[i].longitude), parseFloat(jsonResponse[i].latitude));
        }
    }
};

httpRequest.open('GET', 'http://localhost:3000/api/lighting', true);
httpRequest.send();
