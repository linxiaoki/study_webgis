//app.js
// 地图中心点
var centerPoint = [35.6335, 109.13228];
var map = L.map("mapDiv",{
    center: centerPoint,
    zoom: 5,
    minZoom: 1,
    maxZoom: 15,
    attributionControl: !1
});

var mapServerUrl="http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}";
var mapboxUrl = "http://server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}";


var map2 = L.tileLayer(mapboxUrl,{
    opacity: 1
}).addTo(map);

var map2opacity = L.tileLayer(mapboxUrl,{
    opacity: 0.6
}).addTo(map);
var map1 = L.tileLayer(mapServerUrl,{
    opacity: 1,
    zIndex: 0
}).addTo(map);
baseMap = {
    "map1": map1,
    "streets": map2,
    "map2opaticy": map2opacity
};
var overlayMap = {
    "streets-1":map2,
    "map2opaticy": map2opacity,
    "map-1":map1
};
L.control.layers(baseMap,overlayMap).addTo(map);
var attr = L.control.attribution();
attr.addAttribution('旅游地图相册Demo --- 那些我没去过的城市');
attr.addAttribution('<a href="https://linxiaoki.github.io" target="_blank">@gis</a>');
//attr.addTo(this.map);
