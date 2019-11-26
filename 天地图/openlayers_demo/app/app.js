//app.js
var map;

function onLoad() {
    var zoom = 10;
    map = new TMap("mapDiv");
    map.centerAndZoom(new TLngLat(118.7912, 32.061), zoom);
    map.enableHandleMouseScroll();

    // 添加一组控件
    addControls();

    // 自定义控件1 - 地图类型选择
    jQuery('#mapTypeSelect').on("change", switchingMapType); // 添加 change 事件
    var mapTypeControl = new THtmlElementControl(document.getElementById("mapTypeStyle"));
    mapTypeControl.setLeft(30);
    mapTypeControl.setTop(50);
    map.addControl(mapTypeControl);

    // 自定义控件2 - 地图缩放
    jQuery("#zoomIn").click(() => {
        map.zoomIn();
    })
    jQuery("#zoomOut").click(() => {
        map.zoomOut();
    })
    var zoomControl = new THtmlElementControl(document.getElementById("mapZoom"))
    zoomControl.setLeft(130);
    zoomControl.setTop(50);
    map.addControl(zoomControl)

    // 叠加层
    addOverlays();

    // 编辑
    var points1 = [];
    points1.push(new TLngLat(118.81125, 32.162));
    points1.push(new TLngLat(118.81125, 32.261));
    points1.push(new TLngLat(118.77123, 32.364));
    points1.push(new TLngLat(118.97123, 32.416))
    var line = new TPolyline(points1, {
        strokeColor: 'orange',
        strokeWeight: 6,
        strokeOpacity: 1,
        strokeStyle: "dashed"
    });
    map.addOverLay(line);
    jQuery("div#lineEditControl>input#enable").click(() => line.enableEdit());
    jQuery("div#lineEditControl>input#disable").click(() => line.disableEdit());

    // 给 marker 添加 提示窗
    addMarkerAndInfo(new TLngLat(118.46125, 32.062))

}

// 控件
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

    [navigation_control, overview_control, scale_control, maptype_control].forEach((x) => map.addControl(x));
    maptype_control.setLeft(10);
    maptype_control.setTop(20);
}

// 自定义控件: 绑定函数，根据 MapTypeSelect 选择图层
function switchingMapType(event) {
    switch (event.target.value) {
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

// 覆盖物
function addOverlays() {
    var marker = new TMarker(new TLngLat(118.7912, 32.061));

    var label = new TLabel({
        text: "<a href='http://www.tianditu.com' target='_blank'>天地图...</a>",
        offset: new TPixel(0, 0),
        position: new TLngLat(118.5912, 32.15)
    });

    var infoWin = new TInfoWindow(new TLngLat(118.89, 31.92), new TPixel([0, -34]));
    infoWin.setLabel("添加的信息窗口");

    var points1 = [];
    points1.push(new TLngLat(118.79125, 32.162));
    points1.push(new TLngLat(118.79125, 32.061));
    points1.push(new TLngLat(118.59123, 32.164));
    points1.push(new TLngLat(118.69123, 32.066))
    var line = new TPolyline(points1, {
        strokeColor: 'black',
        strokeWeight: 6,
        strokeOpacity: 1
    });

    var config = {
        strokeColor: 'black',
        strokeWeight: "2px",
        strokeOpacity: 1,
        strokeStyle: "dashed",
        fillColor: '#FFFFFF',
        fillOpacity: 0.6,
    };

    var points2 = [];
    points2.push(new TLngLat(118.89125, 32.162));
    points2.push(new TLngLat(118.89125, 32.061));
    points2.push(new TLngLat(118.79123, 32.066));
    points2.push(new TLngLat(118.69123, 32.164));
    var polygon = new TPolygon(points2, config);

    config["fillColor"] = "black";
    config["fillOpacity"] = 0.2;
    var bounds = new TBounds(118.7912, 32.24, 118.89124, 32.36);
    var rect = new TRect(bounds, config);

    config["fillOpacity"] = 0.7;
    config["strokeStyle"] = "solid";
    config["fillColor"] = "red";
    var ellipse = new TEllipse(bounds, config);

    config["strokeColor"] = "blue";
    config["fillColor"] = "#fffff";
    var circle = new TCircle(new TLngLat(118.7812, 32.19), 5000, config);

    [marker, label, infoWin, line, polygon, rect, ellipse, circle].forEach((x) => map.addOverLay(x));
}

// marker and infoWindow
function addMarkerAndInfo(lnglat_) {
    var marker = new TMarker(lnglat_);
    var customerWinInfo = new TLabel({
        position: lnglat_,
        offset: TPixel(0, 0)
    });

    map.addOverLay(marker);
    TEvent.addListener(marker, "click", onClick); // 注册标注的点击时间


    function onClick() {
        var label_html = `
            <div style="background:#cccc99;height:20px;color:#000;width:135px">
                <span style="width:100px;float:left;margin-left:2px;">自定义信息：</span>
                <span style="width:30px;float: right;margin-right:2px" onclick="onClose();"></span>
            </div>
            <div id="deliver-legend-ctrl" style="background:#fff;border:1px solid #c0c0c0">
            <table cellpacing="0" cellpading="0" style="width:130px;border:1px solid #ff0000">
                <tr align="center" style="height:10px;">
                    <td></td>
                    <td><a href="javascript:void(0);"></a></td>
                </tr>
                <tr align="center">
                    <td>经度: </td>
                    <td>${marker.getLngLat().getLng()}</td>
                </tr>
                <tr align="center">
                    <td>纬度: </td>
                    <td>${marker.getLngLat().getLat()}</td>
                </tr>
                <tr style="height:10px">
                    <td></td>
                    <td><a href="javascript(0);"></a></td>
                </tr>
            </table>
            </div>
        `;
        var config = {
            offset: new TPixel(0,0),
            position: lnglat_
        }
        customerWinInfo.setTitle('---------');
        customerWinInfo.setLabel(label_html);
        customerWinInfo.getObject().style.zIndex=10000;
        map.addOverLay(customerWinInfo);

        var obj = customerWinInfo.getObject();
        var width = parseInt(obj.offsetWidth);
        var height = parseInt(obj.offsetHeight);
        console.log(this);
        var anchor_icon = this.getIcon().getAnchor();
        console.log(anchor_icon)
        var pixel = new TPixel(width/-2,height/-2-anchor_icon[1]);
        customerWinInfo.setOffset(pixel);
    }

    function onClose() {
        map.removeOverlay(customerWinInfo);
    }

}

module.exports = {
    onLoad: onLoad
}