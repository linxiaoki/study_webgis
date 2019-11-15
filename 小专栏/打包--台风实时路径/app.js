//app.js
var mapAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">世界地图</a> contributors, ' +
    '<a href="http://giscafer.com/">giscafer</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var mapboxUrl = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=" +
    "pk.eyJ1IjoiemhhbmdzMTIzIiwiYSI6ImNrMXR6NjZobzAweW0zY3BrcnB4YmF6M3YifQ.nHmNai_UTcEJdy1VTbCXfg";

var satellite = L.tileLayer(mapboxUrl, { id: 'mapbox.satellite', attribution: mapAttr });
var streets = L.tileLayer(mapboxUrl, { id: 'mapbox.streets', attribution: mapAttr });
var grayscale = L.tileLayer(mapboxUrl, { id: 'mapbox.light' });

var map = L.map("mapDiv", {
    center: [45.51, -122.2],
    zoom: 6,
    layers: [
        satellite, streets, grayscale
    ]
});
var basemap = {
    "影像图": satellite,
    "<span style='color: gray'>街道图</span>": streets,
    //'grayscale': grayscale,
};
L.control.layers(basemap).addTo(map);

//回调函数： 动态画线
function addPolylineAndMarker(typhoonData) {
    console.log(typhoonData);
    // 动态画线
    function animateDrawLine(points, icon, popupContent) {
        var drawPoints = [points[0]];
        var marker = L.marker(drawPoints[drawPoints.length - 1], { icon: icon }).addTo(map);
        var lineLayers;
        var count = 0;
        var time = setInterval(() => {
            if (count < points.length - 1) {
                count += 1;
                drawPoints.push(points[count]);
                // lineLaers && map.removeLayer(lineLayers);
                lineLayers && map.removeLayer(lineLayers);
                lineLayers = null;
                map.removeLayer(marker);
                lineLayers = L.polyline(drawPoints, { color: 'blue' }).addTo(map);
                marker = L.marker(drawPoints[drawPoints.length - 1], { icon: icon }).addTo(map);
                if (count == points.length - 1) {
                    marker.bindPopup(popupContent).openPopup();
                }
                //console.log("add")
            } else {
                clearInterval(time);
            }
        }, 200)
    }
    //typhoonCenter=[Number(typhoonData[0]["centerlat"]), Number(typhoonData[0]["centerlng"])];
    //map.panTo(typhoonCenter); 
    var forecast = typhoonData[0]["points"];
    var polylinePoints = [];
    forecast.forEach(point => {
        polylinePoints.push([Number(point['lat']), Number(point['lng'])])
    });
    map.panTo(polylinePoints[0]);
    // 图标
    var typhoonIcon = L.icon({
        iconUrl: './tornado.png',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
    popupContent = '<b>'+ typhoonData[0]['name']+'</b></br>'+
    forecast[forecast.length-1]['jl'];
    // 动态画线
    animateDrawLine(polylinePoints, typhoonIcon, popupContent);
}