//app.js

function onLoad(){
    var map, zoom = 10;
    map = new TMap("mapDiv");
    map.centerAndZoom(new TLngLat(118.7912, 32.061), zoom);
    map.enableHandleMouseScroll();
    var overview_control = new TOverviewMapControl({
        anchor: "TMAP_ANCHOR_BOTTOM_RIGHT",
        size: new TSize(180,210),
        isOpen: true
    });
    addControls(map);

}

// 创建控件
function addControls(map_){
    var navigation_control = new TNavigationControl({
        type: "TMAP_NAVIGATION_CONTROL_LARGE",
        anchor: "TMAP_ANCHOR_TOP_RIGHT",
        offset: [0,0],
        showZoomInfo: true
    });
    var overview_control = new TOverviewMapControl({
        anchor: "TMAP_ANCHOR_BOTTOM_RIGHT",
        size: new TSize(180,210),
        isOpen: true
    });
    var scale_control = new TScaleControl();
    var maptype_control = new TMapTypeControl();

    // 控件一起添加
    [navigation_control, overview_control, scale_control, maptype_control].forEach((x) => map_.addControl(x));
    maptype_control.setLeft(10);
    maptype_control.setTop(20);
}

module.exports = {
    onLoad: onLoad
}