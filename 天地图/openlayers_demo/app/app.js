//app.js
var map;

function onLoad() {
    var tk = "7a1d904db1ad0e570a1b0afc5eab78c4";
    var zoom = 10;
    map = new TMap("mapDiv",{
        projection: "EPSG:4326"  //900913  或  4326
    });

    map.centerAndZoom(new TLngLat(118.7912, 32.061), zoom);
    map.enableHandleMouseScroll(); // 启用滚轮缩放
    map.enableContinuousZoom(); // 启用缩放的效果

    //控件  control
    {
    // 添加一组控件
    addControls();

    // 自定义控件1 - 地图类型选择
    jQuery('#mapTypeSelect').on("change", switchingMapType); // 添加 change 事件
    var mapTypeControl = new THtmlElementControl(jQuery("#mapTypeStyle")[0]);
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
    }

    //覆盖物 overlay - button:编辑多段线、marker+label、聚合marker
    {
    // 叠加层
    addOverlays();

    // 启用/关闭 编辑多段线
    var points1 = [];
    points1.push(new TLngLat(118.81125, 32.162));
    points1.push(new TLngLat(118.81125, 32.261));
    points1.push(new TLngLat(118.77123, 32.364));
    points1.push(new TLngLat(118.97123, 32.416));
    var line = new TPolyline(points1, {
        strokeColor: 'orange',
        strokeWeight: 6,
        strokeOpacity: 1,
        strokeStyle: "dashed"
    });
    map.addOverLay(line);
    jQuery("div#lineEditControl>input#enable").click(() => line.enableEdit());
    jQuery("div#lineEditControl>input#disable").click(() => line.disableEdit());

    // 给 marker 添加 label
    addMarkerAndInfo(new TLngLat(118.46125, 32.072),"自定义信息1：");
    addMarkerAndInfo(new TLngLat(118.46125, 32.172),"2:获取坐标：");
    
    // 聚合marker：加载大量 marker
    // addMarkerClusterer(200);
    jQuery("div>button#showMarkerClusterer").click(()=>{
        addMarkerClusterer(200);
    });
    }
    
    // 事件 event
    {
    // addMapClick();   // click  注册点击事件
    // addMapMoveend();  // moveend  拖拽事件
    addMapMousemove();  // mousemove  鼠标悬浮移动事件
    }

    
    // 图层: 添加自定义图层 ， 添加 wms 图层
    {
        // 添加自定义图层 wmts? ，需要设置正确的坐标系：900913<<<<<<
        var tile_config={opacity: 0.4};
        /*
        tile_config.getTileUrl = (x,y,z)=>{
            return "http://t0.tianditu.gov.cn/img_w/wmts?"+"SERVICE=WMTS&REQUEST=GetTile"+
            "&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles"+
            "&TILECOL="+ x +"&TILEROW="+ y + "&TILEMATRIX="+ z + "&tk="+tk;
        };*/
        var layer = new TTileLayer(tile_config); //创建自定义图层对象
        layer.setGetTileUrl((x,y,z)=>{
            return "http://t0.tianditu.gov.cn/img_w/wmts?"+"SERVICE=WMTS&REQUEST=GetTile"+
            "&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles"+
            "&TILECOL="+ x +"&TILEROW="+ y + "&TILEMATRIX="+ z + "&tk="+tk;
        });  // 设置取图函数，pdf 是在 config 里面也添加了 setGetTileUrl，不过好像不加也不影响。
        if(map.getCode()=="EPSG:900913"){ // 坐标系为墨卡托投影才可显示地图
            map.addLayer(layer);
        }
    
        // 添加 wms 图层,  
        jQuery("div#wmstool").click((ev)=>{
            // 使用 事件委托
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if(map.getCode()!="EPSG:4326"){ //需要设置正确的坐标系： 4326 <<<<<<<<<<<<
                return;
            }
            if(target.nodeName.toLocaleLowerCase() == "input"){
                switch(target.defaultValue){
                    case "叠加超图WMS服务图层":
                        addSuperMapLayer('China','http://support.supermap.com:8090/iserver/services/map-china400/wms111/China');
                        break;
                    case "删除超图WMS服务图层":
                        map.removeLayer(wmsLayer);
                        break;
                }
                //;
            }
        });
    }

    // 工具
    {
        addTools();
        jQuery("div#rectTool").click((ev)=>{
            var ev=ev || window.event;
            var target=ev.target || ev.srcElement;
            if(target.nodeName.toLocaleLowerCase()=="input"){
                switch(target.defaultValue){
                    case "开启":
                        rectTool.open();
                        break;
                    case "关闭":
                        rectTool.close();
                        break;
                    case "清除":
                        console.log("清除")
                        rectTool.clear();
                        break;
                }
            }
        });
    }
    
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

// marker + infoWindow
function addMarkerAndInfo(lnglat_,text) {
    var marker = new TMarker(lnglat_);
    var customerInfoLabel = new TLabel({
        position: lnglat_,
        offset: TPixel(0, 0)
    });

    map.addOverLay(marker);
    TEvent.addListener(marker, "click", onClick); // 注册标注的点击时间

    function onClick() {
        // 给labelClose 的 id 加上时间戳，这样添加多个 merkerAndInfo的时候，不会一起触发关闭事件
        var timestamp = new Date().getTime(); 
        debugger;
        var label_html = `
            <div style="background:#cccc99;height:20px;color:#000;width:135px">
                <span style="width:100px;float:left;margin-left:2px;">${text}</span>
                <span id="labelClose${timestamp}" style="width:30px;float: right;margin-right:3px">关闭</span>
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
            <script>
                debugger;
            </script>
        `;

        customerInfoLabel.setTitle('');   //鼠标悬浮在 label 上会出现标题
        customerInfoLabel.setLabel(label_html);
        customerInfoLabel.getObject().style.zIndex=10000;
        map.addOverLay(customerInfoLabel);

        var obj = customerInfoLabel.getObject();   // label 的 宽，高
        var width = parseInt(obj.offsetWidth);
        var height = parseInt(obj.offsetHeight);
        var anchor_icon = this.getIcon().getAnchor();  // marker 图标的 宽，高
        var pixel = new TPixel(width/-2,height/-2-anchor_icon[1]);
        customerInfoLabel.setOffset(pixel);

        jQuery("span#labelClose"+timestamp).click(()=>{  // 在 addOverLay 后，绑定关闭的事件
            map.removeOverLay(customerInfoLabel);
        });
    }
}

// 聚合Marker
function addMarkerClusterer(MAX){
    map.centerAndZoom(new TLngLat(118.7912, 32.061), 5);
    var markers = [];
    for(var i=0; i<MAX; i++){
        var lnglat = new TLngLat(Math.random()*40+85,Math.random()*30+21);
        markers.push(new TMarker(lnglat));
    }
    var markerCluster = new TMarkerClusterer(map,{
        markers: markers
    });

}


// 注册和移除点击事件  (弹出对话框，内容为点击坐标)
var mapclick;
function addMapClick(){
    removeMapClick();
    mapclick = TEvent.addListener(map,"click",function(p){
        var lnglat = map.fromContainerPixelToLngLat(p);
        alert(lnglat.getLng()+","+lnglat.getLat());
    });
}
function removeMapClick(){
    TEvent.removeListener(mapclick);
}

// 注册和移除地图拖拽事件 (弹出对话框，内容为拖拽后中心点的坐标)
var mapmoveend;
function addMapMoveend(){
    removeMapMoveend();
    mapmoveend = TEvent.addListener(map,"moveend",function(lnglat){
        alert(lnglat.getLng()+","+lnglat.getLat());
    });
}
function removeMapMoveend(){
    TEvent.removeListener(mapmoveend);
}

// 注册和移除地图滑动事件: 鼠标移动显示当前坐标
var mapmousemmove;
function addMapMousemove(){
    removeMousemove();
    TEvent.addListener(map,"mousemove",(p)=>{
        var lnglat = map.fromContainerPixelToLngLat(p);
        jQuery("input#info").val(lnglat.getLng()+","+lnglat.getLat());
    })
}
function removeMousemove(){
    TEvent.removeListener(mapmousemmove);
}


// 添加 WMS 图层
var wmsLayer;
function getWMS(layerName,url,config){
    if(wmsLayer){
        map.removeLayer(wmsLayer);
    }
    wmsLayer = new TTileLayerWMS(layerName,url,config);  // 创建WMS图层对象
    map.addLayer(wmsLayer);
}
function addSuperMapLayer(layers,url){
    var config = {
        REQUEST: "GetMap", //操作名称
        VERSION: "1.1.1",
        SERVICE: "WMS",  // 服务类型标识符
        LAYERS: layers,
        TRANSPARNENT: true, //输出图像背景是否透明
        STYLES:"",  // 每个请求图层的用 "," 分隔的描述样式
        FORMAT: "image/png",
        SRS:map.getCode(),  // 地图的投影类型
        WIDTH: 256,  //图片像素宽
        HEIGHT:256
    };
    getWMS(layers,url,config);
}

// 工具
var rectTool;
function addTools(){
    var rect;
    // 矩形绘制工具
    var config={
        strokeColor: "blue",
        strokeWeight:"5px",
        strokeStyle: "solid",
        fillColor:"#FFFFFF",
        opacity:0.5
    };
    rectTool = new TRectTool(map,config);
    TEvent.addListener(rectTool,"draw",(bounds)=>{
        // 注册矩形工具绘制完成后的事件
        rect=new TRect(bounds);
        map.addOverLay(rect);
        //rectTool.close(); //？？ 有必要吗，不是有关闭的按钮了
    });
}


module.exports = {
    onLoad: onLoad
}