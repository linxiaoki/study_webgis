//app.js
import statesData from "./us-states";
var map;
var mpaboxAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,<a href="https://creativecommons.org/licenses/by-sa/2.0/"CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/"Mapbox</a>';
var mapboxAccessToken = 'pk.eyJ1IjoiZWRlbjEwNyIsImEiOiJjaXdtMnl5aDYwMDBhMm5tdHV2M3JvYjN2In0.q6DngKEYuQJtBIMWDlNucw';
var mapboxUrl = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + mapboxAccessToken;


// 初始化地图
function onLoad() {
    var zoom = 11;
    var streets = L.tileLayer(mapboxUrl, {
        id: 'mapbox/streets-v11',
        attribution: mpaboxAttribution,
        //maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1
    });
    var grayscale = L.tileLayer(mapboxUrl, {
        id: 'mapbox/light-v9',
        attribution: mpaboxAttribution,
        tileSize: 512,
        zoomOffset: -1
    });
    map = L.map('mapDiv', {
        center: [51.505, -0.09],
        zoom: 6,
        layers: [streets, grayscale]
    });  //.setView([51.505,-0.09], 11).setZoom(6);


    // 创建标记marker，圆circle，多边形polygon，提示窗口，绑定 popup
    createOverlay();

    // 点击事件 - 弹出坐标 
    map.on('click', function (e) {
        var lat = e.latlng["lat"].toFixed(6).toString();
        var lng = e.latlng["lng"].toFixed(6).toString();
        console.log("纬度：" + lat + "，经度：" + lng);
        L.popup().setLatLng(e.latlng).setContent("纬度：" + lat + "，经度：" + lng).openOn(map);
    });
    map.off('click');  // 取消 点击事件

    // 示例3：自定义marker L.Icon.extend({})
    createLeafMarker();

    // 示例4：使用 GeoJson
    createGeojsonLayer();


    // marker, circle, polygon, popup
    function createOverlay() {
        var marker = L.marker([51.5, -0.09]).addTo(map);
        var circle = L.circle([51.508, -0.11], {
            color: 'red',
            weight: 4,
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(map).bindPopup("I am a circle.");
        var polygon = L.polygon([[51.509, 0.08], [51.48, 0.06], [51.51, 0.02]], {
            color: 'black'
        }).addTo(map).bindPopup("Im am a popygon.");
        marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
        //var popup = L.popup().setLatLng([51.55, -0.09]).setContent("I am a standalone popup.").addTo(map);
    }

    // 示例3：自定义 marker
    // 示例6：添加图层组控件
    function createLeafMarker() {
        var leafIcon = L.Icon.extend({
            options: { // 这些是共同的选项
                shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
                shadowSize: [50, 64],   //  dx-2, dy-2
                shadowAnchor: [4, 62],  //      , dy -4
                iconSize: [38, 95],     //  dx-2, dy-2
                iconAnchor: [22, 94],    //  dx/2+2, dy-3  ,图标相对于左上角的坐标，这个坐标是地图标记的地理位置
                popupAnchor: [-3, -76]  // 弹出窗口将“打开”的点的坐标。
            }
        });
        var greenIcon = new leafIcon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png' }),
            redIcon = new leafIcon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png' }),
            orangeIcon = new leafIcon({ iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png' });
        // groupLayer 一起添加
        var marker1 = L.marker([51.509, 0.08], { icon: greenIcon }).bindPopup("I am a green leaf."),
            marker2 = L.marker([51.48, 0.06], { icon: redIcon }).bindPopup("I am a red leaf."),
            marker3 = L.marker([51.51, 0.02], { icon: orangeIcon }).bindPopup("I am a orange leaf.");
        var leafLayer = L.layerGroup([marker1, marker2, marker3]).addTo(map);
        // 在这添加图层控件吧
        L.control.layers({
            "<span style='color:gray'>GrayScale</span>": grayscale,
            "Streets": streets
        }, {
            "Leaf.": leafLayer
        }).addTo(map);
    }

    // 示例4：使用GeoJson
    // 初始化先加入点标记，设置样式和 点转换函数，后续再添加线和多边形。
    function createGeojsonLayer() {
        // geometry -> type: Point, MutiPoint, LineString, MultiLineString, 
        //                   Polygon, MultiPolygon, GeometryCollection
        var geojsonPointFeature = [{
            "type": "Feature",  // Feature Or FeatureCollection ?
            "properties": {
                "name": "Coors Field",
                "amenity": "Baseball Stadium",
                "popupContent": "This is where the Rockies play!",
                "show_off_map": false
            },
            "geometry": {
                "type": "Point",
                "coordinates": [2, 50]   //[-104.99404, 39.75621]
            }
        }, {
            "type": "Feature",
            "properties": {
                "name": "Some Point",
                "popupContent": "This is not visible...",
                "show_off_map": true  // 使用filter把筛选掉了。
            },
            "geometry": {
                "type": "Point",
                "coordinates": [2.5, 49.6]
            }
        }];
        // 初始化时，添加点的数据 geojsonPointFeature
        var myGeoLayer = L.geoJSON(geojsonPointFeature, {
            // 设置样式
            style: function (feature) {
                switch (feature.geometry.type) {
                    // 多边形
                    case "Polygon": switch (feature.properties.party) {
                        case "Republican": return { color: "#ff0000" };
                        case "Democrat": return { color: "#0000ff" };
                        default: return { "color": "#ff7800" }
                    };
                    // 线
                    case "LineString": return { color: "#ff7800", weight: 5 };
                    // 点 与 其他不同
                    // 其他
                    default: return { "color": "#ff7800" }
                }
            },
            // 设置点转换函数：
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            // 设置添加 each 函数，若存在 popup,则绑定
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.popupContent) {
                    //console.log(feature.properties.popupContent);
                    layer.bindPopup(feature.properties.popupContent);
                }
            },
            // 设置过滤函数
            filter: function (feature, layer) {
                //console.log(feature.properties.show_on_map);
                // 默认是展示 feature
                return !(feature.properties && feature.properties.show_off_map);
            }
        }).addTo(map);

        // 线：LineString
        var myLines = [{
            "type": "LineString",
            "coordinates": [[2, 50], [-3, 55], [-8, 65]]
        }, {
            "type": "LineString",
            "coordinates": [[4, 52], [-1, 57], [-6, 67]]
        }];
        var myPoints = [{
            "type": "Point",
            "coordinates": [2, 50.5]
        }, {
            "type": "Point",
            "coordinates": [4, 52.5]
        }];
        myGeoLayer.addData(myPoints);
        myGeoLayer.addData(myLines);
        // 多边形：Polygon
        var states = [{
            "type": "Feature",
            "properties": { "party": "Republican", "popupContent": "Republican...." },
            "geometry": {
                type: "Polygon",
                "coordinates": [[
                    [-77.05, 48.99],
                    [-70.22, 48.98],
                    [-69.58, 45.94],
                    [-77.03, 45.94],
                    [-77.05, 48.99]
                ]]
            }
        }, {
            "type": "Feature",
            "properties": { "party": "Democrat", "popupContent": "Democrat..." },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-82.05, 41.00],
                    [-75.06, 40.99],
                    [-75.03, 36.99],
                    [-82.04, 36.99],
                    [-82.05, 41.00]
                ]]
            }
        }];
        myGeoLayer.addData(states);
        map.flyTo([45, -73]);
    }
}




// -------------------------------------
// 手机端展示 + 定位
function onLoad_mobile() {
    //map = L.map('mapDiv').setView([51.505,-0.09], 11);
    map = L.map('mapDiv').fitWorld();
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        id: 'mapbox/streets-v11',
        accessToken: mapboxAccessToken,
        attribution: mpaboxAttribution,
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);
    // 定位
    map.locate({ setView: true, maxZoom: 16 });
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
}

function onLocationFound(e) {
    var radius = e.accuracy;
    console.log("radius:", radius);
    L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + "meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);
}
function onLocationError(e) {
    switch (e.code) {
        case 0:
            alert("尝试获取您的位置信息时发生错误：" + e.message);
            break;
        case 1:
            alert("用户拒绝了获取位置信息请求。");
            break;
        case 2:
            alert("浏览器无法获取您的位置信息。");
            break;
        case 3:
            salert("获取您位置信息超时。");
            break;
    }
    alert(e.message);
}

// -------------
// 交互式地图
export function onLoad_InteractiveMap() {
    map = L.map("mapDiv").setView([37.8, -96], 2);
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + mapboxAccessToken, {
        id: 'mapbox/light-v9',
        attribution: mpaboxAttribution,
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);
    // geoLayer 图层加载
    var geoLayer = L.geoJSON(statesData, {
        style: style,
        onEachFeature: function (feature, layer) {
            /* console.log("feature");
            console.log(feature);
            console.log("layer");
            console.log(layer); */
            // 添加 bindPopup
            if (feature.properties && feature.properties.name) {
                layer.bindPopup("This is " + feature.properties.name + " state!").addTo(map);
            }
            // 添加监听事件
            layer.on({
                mouseover: highlightFeature, // 鼠标悬浮
                mouseout: resetHighlight, // 鼠标离开区域
                click: zoomToFeature
            });
        }
    }).addTo(map);
    // 信息控件
    var info = L.control();
    info.onAdd = function (map) {
        //创建 div 标签，这里的 this 是 `info`
        this._div = L.DomUtil.create('div', 'info');
        this.update();  //地图渲染刷新, 控件显示
        return this._div;  // 返回 div 控件
    }
    // 更新 div 控件的函数
    info.update = function (props) {
        this._div.innerHTML = '<h4>美国人口密度：</h4>' +
            (props ? `<b>${props.name}</b><br/>${props.density} 人/米<sup>2</sup>` : 'Hover over a state');
    }
    info.addTo(map); // 只有最后才能 addTo(map);
    // 图例控件
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000];
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                `<i style="background:${getColor(grades[i] + 1)}"></i>
                ${grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')}`
        }
        console.log(div);
        return div;
    }
    legend.addTo(map);

    // 设置样式，根据 密度 修改颜色
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            fillOpacity: 0.7,
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: '3',
        }
    }

    // 返回颜色
    function getColor(d) {
        return d > 1000 ? '#800026' :
            d > 500 ? '#BD0026' :
                d > 200 ? '#E31A1C' :
                    d > 100 ? '#FC4E2A' :
                        d > 50 ? '#FD8D3C' :
                            d > 20 ? '#FEB24C' :
                                d > 10 ? '#FED976' :
                                    '#FFEDA0';
    }

    // 鼠标悬浮时，样式突出
    function highlightFeature(e) {
        var layer = e.target;  //layer.feature
        layer.setStyle({
            //边框加粗, 黑色，实线
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) { // ie, Opera, edge 浏览器跳过，因为会报错
            layer.bringToFront();
        }
        // 更新信息控件显示
        info.update(layer.feature.properties);
    }
    // 点击后，缩放
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }
    // 点击后，样式重置
    function resetHighlight(e) {
        geoLayer.resetStyle(e.target);
        // 更新信息控件显示
        info.update();
    }
}

// 缩放等级
export function onLoad_zoomlevel(){
    map = L.map('mapDiv',{
        minZoom: 1,
        maxZoom: 1
    });
    var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';
    var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
        attribution: cartodbAttribution
    }).addTo(map);
    map.setView([0,0],1);
    L.control.scale().addTo(map);
    setInterval(function(){
        map.setView([0,0]);
        setTimeout(function(){
            map.setView([60,0]);
        },2000);
    },4000);
}

// 游戏地图
export function onLoad_gamemap(){
    map = L.map('mapDiv',{
        crs: L.CRS.Simple,
        minZoom: -5
    });
    var bounds = [[-26.5,-25],[1021.5,1023]];  // 地图单位的范围 ， 图片的像素大小是：2315 × 2315
    var image = L.imageOverlay('https://leafletjs.com/examples/crs-simple/uqm_map_full.png',bounds).addTo(map);
    map.fitBounds(bounds);
    // 坐标系统：latlng(yx) =>  lnglat(xy)
    var yx = L.latLng;
    var xy = function(x,y){ // 以x,y的顺序输入坐标值，返回正确的坐标对象L.LatLng
        return L.Util.isArray(x) ? yx(x[1],x[0]) : yx(y,x);
    }
    // 添加marker
    // 图片像素是： 2315 * 2315
    var sol = L.latLng([145, 175.2]);
    var sol = xy(175.2, 145);
    var mizar = xy(41.6, 130.1);
    var kruegerZ = xy(13.4, 56.5);
    var deneb = xy(218.7, 8.3);
    L.marker(sol     ).bindPopup('Sol'      ).addTo(map);
    L.marker(mizar   ).bindPopup('Mizar'    ).addTo(map);
    L.marker(kruegerZ).bindPopup('Krueger-Z').addTo(map);
    L.marker(deneb   ).bindPopup('Deneb'    ).addTo(map);
    var travel = L.polyline([sol, deneb]).addTo(map);
    map.setView([120,270],1);
}


// 图层：使用WMS服务
export function onLoad_WMS(){
    map = L.map("mapDiv",{
        //crs: L.CRS.EPSG4326,
        center: [50, -1],
        zoom: 5
    });
    // 添加wms服务的图层，可以先用 QGIS 查看有什么图层
    // http://ows.mundialis.de/services/service?request=GetCapabilities
    var wmsurl = 'http://ows.mundialis.de/services/service?';
    var basemaps = {
        'Topography': L.tileLayer.wms(wmsurl,{
            layers: 'TOPO-WMS'
        }),
        'Places': L.tileLayer.wms(wmsurl,{
            layers: 'OSM-Overlay-WMS'
        }),
        'Topography, then places': L.tileLayer.wms(wmsurl,{
            layers: 'TOPO-WMS,OSM-Overlay-WMS'
        }),
        'Places, then topography': L.tileLayer.wms(wmsurl,{
            layers: 'OSM-Overlay-WMS,TOPO-WMS'
        }),
        'Topograph-OSM-WMS': L.tileLayer.wms(wmsurl,{
            layers: 'TOPO-OSM-WMS'
        })
    };
    L.control.layers(basemaps).addTo(map); // 图层管理控件
    basemaps.Topography.addTo(map);
}

// panes：自定义图层顺序
export function onLoad_panes(){
    var map = L.map('mapDiv',{
        center: [30,10],
        zoom: 5
    });
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;
    map.getPane('labels').style.pointerEvents = 'none';
    var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/{id}/{z}/{x}/{y}.png',{
        id: "light_nolabels",
        attribution: '&copy;OpenStreetMap, &copy;CartoDB'
    }).addTo(map);
    var positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/{id}/{z}/{x}/{y}.png',{
        id: 'light_only_labels',
        attribution: '&copy;OpenStreetMap, &copy;CartoDB',
        pane: 'labels'
    }).addTo(map);
    // geojson 数据在哪？
    /* 
    var geojson = L.geoJson(GeoJsonData, geoJsonOptions).addTo(map);
    geojson.eachLayer(function(layer){
        layer.bindPopup(layer.feature.properties.name);
    });
    map.fitBounds(geojson.getBounds()); */
}

// video in webpack
export function onLoad_video(){
    var map = L.map('mapDiv',{
        center: [37.8, -96],
        zoom: 4
    });
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+mapboxAccessToken,{
        id: 'mapbox/satellite-v9',
        attribution: mpaboxAttribution,
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);
    var bounds = L.latLngBounds([[32,-130],[13,-100]]);
    L.rectangle(bounds).addTo(map);
    map.fitBounds(bounds);
    var videoUrls = [
        'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
        //'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
    ];
    var videoOverlay = L.videoOverlay(videoUrls, bounds, {
        opacity: 0.6
    }).addTo(map);
    // load 初始化时触发
    videoOverlay.on('load',function(){
        // 暂停
        var MyPauseControl = L.Control.extend({
            onAdd: function(){
                var button = L.DomUtil.create('button');
                button.innerHTML = '⏸';
                L.DomEvent.on(button, 'click', function(){
                    videoOverlay.getElement().pause();
                });
                return button;
            }
        })
        // 开始
        var MyplayControl_ = L.control();
        MyplayControl_.onAdd = function(){
            this._button = L.DomUtil.create('button');
            this._button.innerHTML = '▶️';
            L.DomEvent.on(this._button, 'click', function(){
                videoOverlay.getElement().play();
            })
            return this._button;
        }
        /* var MyPlayControl = L.Control.extend({
            onAdd: function(){
                var button = L.DomUtil.create('button');
                button.innerHTML = '▶️';
                L.DomEvent.on(button, 'click', function(){
                    console.log("Element: ", videoOverlay.getElement());
                    videoOverlay.getElement().play();
                })
                return button;
            }
        }); */

        // 添加控件到地图
        // ！ 暂停与开始，两种创建控件的方式，一种是扩展后new
        var pauseControl = (new MyPauseControl()).addTo(map);
        MyplayControl_.addTo(map);
        //var playControl = (new MyPlayControl()).addTo(map);
    })
}


export {
    onLoad as default, onLoad_mobile
}

/* module.exports = {
    onLoad: onLoad,
    onLoad_mobile: onLoad_mobile,
    onLoad_InteractiveMap: onLoad_InteractiveMap,
}
*/