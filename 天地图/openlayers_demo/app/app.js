//app.js
var map;

function onLoad() {
    var zoom = 10;
    map = new TMap("mapDiv");
    map.centerAndZoom(new TLngLat(118.7912, 32.061), zoom);
    map.enableHandleMouseScroll();
    var overview_control = new TOverviewMapControl({
        anchor: "TMAP_ANCHOR_BOTTOM_RIGHT",
        size: new TSize(180, 210),
        isOpen: true
    });
    addControls(map);

    var mapTypeStyle = document.getElementById("mapTypeStyle");
    var mapTypeControl = new THtmlElementControl(mapTypeStyle);
    mapTypeControl.setRight(80);
    mapTypeControl.setTop(10);
    map.addControl(mapTypeControl);
}

// 创建控件
function addControls() {
    var navigation_control = new TNavigationControl({
        type: "TMAP_NAVIGATION_CONTROL_LARGE",
        anchor: "TMAP_ANCHOR_TOP_RIGHT",
        offset: [0, 0],
        showZoomInfo: true
    });
    var overview_control = new TOverviewMapControl({
        anchor: "TMAP_ANCHOR_BOTTOM_RIGHT",
        size: new TSize(180, 210),
        isOpen: true
    });
    var scale_control = new TScaleControl();
    var maptype_control = new TMapTypeControl();

    // 控件一起添加
    [navigation_control, overview_control, scale_control, maptype_control].forEach((x) => map.addControl(x));
    maptype_control.setLeft(10);
    maptype_control.setTop(20);
}

// 自定义控件
// 根据 MapTypeSelect 选择图层
function switchingMapType1(obj) {
    switch (obj.value) {
        case "TMAP_NORMAL_MAP": setNormal();
            break;
        case "TMAP_SATELLITE_MAP": setSatellite();
            break;
        case "TMAP_HYBRID_MAP": setHybrid();
            break;
        case "TMAP_TERRAIN_MAP": setTerrain();
            break;
        case "TMAP_TERRAIN_HYBRID_MAP": setTerrainHybrid();
            break;
    }
    function setNormal() {
        map.setMapType(TMAP_NORMAL_MAP);
    }
    function setSatellite() {
        map.setMapType(TMAP_SATELLITE_MAP);
    }
    function setHybrid() {
        map.setMapType(TMAP_HYBRID_MAP);
    }
    function setTerrain() {
        map.setMapType(TMAP_TERRAIN_MAP);
    }
    function setTerrainHybrid() {
        map.setMapType(TMAP_TERRAIN_HYBRID_MAP);
    }
}

module.exports = {
    onLoad: onLoad
}