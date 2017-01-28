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

};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 54.7732, lng: -1.5764},
        zoom: 15,
        mapTypeId:'roadmap'
    });



    putlightdatapoint(54.7757,-1.5800);
    putlightdatapoint(54.6579981783391,-1.6564880515062919);
    putlightdatapoint(54.657765889695185,-1.6569705299177497);
    putlightdatapoint(54.657550827368524,-1.657189348207779);
    putlightdatapoint(54.65730867372061,-1.6573618904630154);
    putlightdatapoint(54.657939741906816,-1.6580696180436134);
    putlightdatapoint(54.657891305972186,-1.65682996789844);
    putlightdatapoint(54.88209123116476,-1.6047087084639704);
    putlightdatapoint(54.8817681870016,-1.6048521473167259);
    putlightdatapoint(54.88144559833763,-1.605135857222234);
    putlightdatapoint(54.88123069063395,-1.6053717521754385);

}