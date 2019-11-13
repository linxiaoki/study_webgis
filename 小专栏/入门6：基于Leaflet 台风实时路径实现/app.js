//app.js
// 自定义版权信息
//import data from "./data.json"
//console.log(data);
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
    zoom: 4,
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

// 点击按钮实现
//回调函数添加路径
function addPolyline(typhoonData) {
    // 动态画线
    function animateDrawLine(points) {
        var drawPoints = [points[0]];
        var lineLayers;
        var count = 0;
        var time = setInterval(() => {
            if (count < points.length - 1) {
                count += 1;
                drawPoints.push(points[count]);
                if (lineLayers) {
                    map.removeLayer(lineLayers);
                }
                lineLayers = null;
                lineLayers = L.polyline(drawPoints, { color: 'red' }).addTo(map);
                console.log("add")
            } else {
                clearInterval(time);
            }
        }, 1000)
    }
    //typhoonCenter=[Number(typhoonData[0]["centerlat"]), Number(typhoonData[0]["centerlng"])];
    //map.panTo(typhoonCenter);
    var forecast = typhoonData[0]["points"];
    var polylinePoints = [];
    forecast.forEach(point => {
        polylinePoints.push([Number(point['lat']), Number(point['lng'])])
    });
    //图标
    map.panTo(polylinePoints[-1]);
    var typhoonIcon = L.icon({
        iconUrl: './typhoon.png',
        iconsize: [28, 28],
        iconAnchor: [1, 1]
    });
    L.marker(polylinePoints[-1], { icon: typhoonIcon }).addTo(map);
    //动态
    animateDrawLine(polylinePoints);
    //var polyLine = L.polyline(polylinePoints,{color:'blue'}).addTo(map);
}

