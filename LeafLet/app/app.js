//app.js
import statesData from "./us-states";
var map;

// 初始化地图
function onLoad(){
    var zoom = 11;
    map = L.map('mapDiv').setView([51.505,-0.09], 11).setZoom(6);
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1Ijoia2Fzcy0xIiwiYSI6ImNrODlsNGRhMTA4OW0zZm5yNW1leGQwdngifQ.C4h5d62ciJWjKq1cDsEjzQ',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,<a href="https://creativecommons.org/licenses/by-sa/2.0/"CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/"Mapbox</a>',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
    }).addTo(map);

    // 创建标记marker，圆circle，多边形polygon，提示窗口，绑定 popup
    createOverlay();

    // 点击事件 - 弹出坐标 
    map.on('click',function(e){
        var lat = e.latlng["lat"].toFixed(6).toString();
        var lng = e.latlng["lng"].toFixed(6).toString();
        console.log("纬度："+ lat +"，经度：" + lng);
        L.popup().setLatLng(e.latlng).setContent("纬度："+ lat +"，经度：" + lng).openOn(map);
    });
    map.off('click');  // 取消 点击事件

    // 示例3：自定义marker L.Icon.extend({})
    createLeafMarker();

    // 示例4：使用 GeoJson
    createGeojsonLayer();
}

// marker, circle, polygon, popup
function createOverlay(){
    var marker = L.marker([51.5,-0.09]).addTo(map);
    var circle = L.circle([51.508, -0.11],{
        color: 'red',
        weight: 4,
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map).bindPopup("I am a circle.");
    var polygon = L.polygon([[51.509,0.08],[51.48,0.06],[51.51,0.02]],{
        color: 'black'
    }).addTo(map).bindPopup("Im am a popygon.");
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    //var popup = L.popup().setLatLng([51.55, -0.09]).setContent("I am a standalone popup.").addTo(map);
}

// 示例3：自定义 marker
function createLeafMarker(){
    var leafIcon = L.Icon.extend({
        options:{ // 这些是共同的选项
            shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
            shadowSize: [50, 64],   //  dx-2, dy-2
            shadowAnchor: [4, 62],  //      , dy -4
            iconSize: [38, 95],     //  dx-2, dy-2
            iconAnchor: [22,94],    //  dx/2+2, dy-3  ,图标相对于左上角的坐标，这个坐标是地图标记的地理位置
            popupAnchor: [-3, -76]  // 弹出窗口将“打开”的点的坐标。
        }
    });
    var greenIcon = new leafIcon({iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png'}),
        redIcon = new leafIcon({iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png'}),
        orangeIcon = new leafIcon({iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png'});
    L.marker([51.509, 0.08],{icon: greenIcon}).addTo(map).bindPopup("I am a green leaf.");
    L.marker([51.48, 0.06],{icon: redIcon}).addTo(map).bindPopup("I am a red leaf.");
    L.marker([51.51, 0.02],{icon: orangeIcon}).addTo(map).bindPopup("I am a orange leaf.");
}

// 示例4：使用GeoJson
// 初始化先加入点标记，设置样式和 点转换函数，后续再添加线和多边形。
function createGeojsonLayer(){
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
    },{
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
    var myGeoLayer = L.geoJSON(geojsonPointFeature,{
        // 设置样式
        style: function(feature){
            switch(feature.geometry.type){
                // 多边形
                case "Polygon": switch(feature.properties.party){
                    case "Republican": return {color: "#ff0000"};
                    case "Democrat": return {color: "#0000ff"};
                    default: return {"color": "#ff7800"}
                };
                // 线
                case "LineString": return {color: "#ff7800",weight:5};
                // 点 与 其他不同
                // 其他
                default: return {"color": "#ff7800"}
            }
        },
        // 设置点转换函数：
        pointToLayer: function(feature, latlng){
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
        onEachFeature: function(feature, layer){
            if(feature.properties && feature.properties.popupContent){
                //console.log(feature.properties.popupContent);
                layer.bindPopup(feature.properties.popupContent);
            }
        },
        // 设置过滤函数
        filter: function(feature, layer){
            //console.log(feature.properties.show_on_map);
            // 默认是展示 feature
            return !(feature.properties && feature.properties.show_off_map);
        }
    }).addTo(map);

    // 线：LineString
    var myLines = [{
        "type": "LineString",
        "coordinates": [[2, 50], [-3, 55], [-8, 65]]
    },{
        "type": "LineString",
        "coordinates": [[4, 52], [-1, 57], [-6,67]]
    }];
    var myPoints = [{
        "type": "Point",
        "coordinates": [2, 50.5]
    },{
        "type": "Point",
        "coordinates": [4, 52.5]
    }];
    myGeoLayer.addData(myPoints);
    myGeoLayer.addData(myLines);
    // 多边形：Polygon
    var states = [{
        "type": "Feature",
        "properties": {"party": "Republican","popupContent": "Republican...."},
        "geometry": {
            type: "Polygon",
            "coordinates": [[
                [-104.05, 48.99],
                [-97.22,  48.98],
                [-96.58,  45.94],
                [-104.03, 45.94],
                [-104.05, 48.99]
            ]]
        }
    },{
        "type": "Feature",
        "properties": {"party": "Democrat","popupContent": "Democrat..."},
        "geometry":{
            "type": "Polygon",
            "coordinates":[[
                [-109.05, 41.00],
                [-102.06, 40.99],
                [-102.03, 36.99],
                [-109.04, 36.99],
                [-109.05, 41.00]
            ]]
        }
    }];
    myGeoLayer.addData(states);   
    map.flyTo([45, -100]);
}


// -------------------------------------
// 手机端展示 + 定位
function onLoad_mobile(){
    //map = L.map('mapDiv').setView([51.505,-0.09], 11);
    map = L.map('mapDiv').fitWorld();
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',{
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1Ijoia2Fzcy0xIiwiYSI6ImNrODlsNGRhMTA4OW0zZm5yNW1leGQwdngifQ.C4h5d62ciJWjKq1cDsEjzQ',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/"OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/"CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);
    // 定位
    map.locate({setView: true, maxZoom: 16});
    map.on('locationfound',onLocationFound);
    map.on('locationerror',onLocationError);
}

function onLocationFound(e){
    var radius = e.accuracy;
    console.log("radius:",radius);
    L.marker(e.latlng).addTo(map).bindPopup("You are within "+ radius + "meters from this point").openPopup();
    L.circle(e.latlng,radius).addTo(map);
}
function onLocationError(e){
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
export function onLoad_InteractiveMap(){
    var mapboxAccessToken = 'pk.eyJ1Ijoia2Fzcy0xIiwiYSI6ImNrODlsNGRhMTA4OW0zZm5yNW1leGQwdngifQ.C4h5d62ciJWjKq1cDsEjzQ',
    map = L.map("mapDiv").setView([37.8, -96], 2);
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + mapboxAccessToken,{
        id: 'mapbox/light-v9',
        attribution:  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,<a href="https://creativecommons.org/licenses/by-sa/2.0/"CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/"Mapbox</a>',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);
    // geoLayer 图层加载
    var geoLayer = L.geoJSON(statesData,{
        style: style,
        onEachFeature: function(feature, layer){
            /* console.log("feature");
            console.log(feature);
            console.log("layer");
            console.log(layer); */
            // 添加 bindPopup
            if(feature.properties && feature.properties.name){
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
    info.onAdd = function(map){
        //创建 div 标签，这里的 this 是 `info`
        this._div = L.DomUtil.create('div','info');
        this.update();  //地图渲染刷新, 控件显示
        return this._div;  // 返回 div 控件
    }
    // 更新 div 控件的函数
    info.update = function(props){
        this._div.innerHTML = '<h4>美国人口密度：</h4>' + 
            (props? `<b>${props.name}</b><br/>${props.density} 人/米<sup>2</sup>` : 'Hover over a state');
    }
    info.addTo(map); // 只有最后才能 addTo(map);
    // 图例控件
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map){
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000];
        for(var i = 0 ;i<grades.length;i++){
            div.innerHTML += 
                `<i style="background:${getColor(grades[i]+1)}"></i>
                ${grades[i] + (grades[i+1] ? '&ndash;'+grades[i+1]+'<br>':'+')}`
        }
        console.log(div);
        return div;
    }
    legend.addTo(map);

    // 设置样式，根据 密度 修改颜色
    function style(feature){
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
    function getColor(d){
        return  d > 1000 ? '#800026' :
                d > 500  ? '#BD0026' :
                d > 200  ? '#E31A1C' :
                d > 100  ? '#FC4E2A' :
                d > 50   ? '#FD8D3C' :
                d > 20   ? '#FEB24C' :
                d > 10   ? '#FED976' :
                           '#FFEDA0' ;
    }

    // 鼠标悬浮时，样式突出
    function highlightFeature(e){
        var layer = e.target;  //layer.feature
        layer.setStyle({
            //边框加粗, 黑色，实线
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        if(!L.Browser.ie && !L.Browser.opera && !L.Browser.edge){ // ie, Opera, edge 浏览器跳过，因为会报错
            layer.bringToFront();
        }
        // 更新信息控件显示
        info.update(layer.feature.properties);
    }
    // 点击后，缩放
    function zoomToFeature(e){
        map.fitBounds(e.target.getBounds());
    }
    // 点击后，样式重置
    function resetHighlight(e){
        geoLayer.resetStyle(e.target);
        // 更新信息控件显示
        info.update();
    }
}


export {
    onLoad as default, onLoad_mobile
}

/* module.exports = {
    onLoad: onLoad,
    onLoad_mobile: onLoad_mobile,
    onLoad_InteractiveMap: onLoad_InteractiveMap,
} */