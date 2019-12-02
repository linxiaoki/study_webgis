//app.js
var centerPoint = [35.63452, 109.132287];
var map = L.map("mapDiv",{
    center: centerPoint,
    zoom: 6,
    minZoom: 1,
    maxZoom: 15,
    attributionControl: !1
});
var mapServerUrl = "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}";
L.tileLayer(mapServerUrl,{
    opacity: 1,
    zIndex: 0
}).addTo(map);

var attr = L.control.attribution();
attr.addAttribution("旅游地图相册Demo——那些我去过的城市");
attr.addAttribution('<a href="https://linxiaoki/github.io/">主页</a>')
attr.addTo(map);
/*
$.ajax("http://typhoon.zjwater.gov.cn/Api/TyphoonInfo/201925",{
    dataaType: "jsonp",
    jsonp: "callback",
    "callback": 'getData1'
});
function gteData1(result){
    console.log(result);
}

$.getJSON("data/data.json",function(result){
    console.log("1")
    console.log(result);
    drawFootPoint(resule.rows);
});
*/
var footIcon = L.icon({
    iconUrl: "./foot.png",
    iconSize: [28,28],
    iconAnchor: [10, 10]
});
drawFootPoint(result["rows"],footIcon);


//函数
function drawFootPoint(data,icon){
    for (let i=0;i<data.length;i++){
        let p = data[i];
        let point = [p["latitude"]-0,p["longitude"]-0];
        L.marker(point,{icon: icon}).addTo(map)
            .bindPopup( "<h3>"+p['city']+"</h3>"+p['date']+"</br>"+p["remark"]+
            "</br>"+generatePicHtml(p.imgs || []));
    }
}

/**
 * 动态拼接html字符串
 * @param {string} cityName 城市名称
 * @param {*} imgs 足迹点数据中imgs数组
 */
function generatePicHtml(imgs){
    var _html = '<div id="galley"><ul class="pictures" onclick="viewPic()">';
    for(var i=0;i<imgs.length;i++){
        var url = './data/pictures/'+imgs[i];
        var display = 'style="display:inline-lock"';
        if(i>5){
            display = 'style="display:none"';
        }
        _html += '<li ' + display + '><img data-original="' +
            url + '" src="' + url + '" alt="图片预览"></li>';
    }
    _html += '</ul></div>'
    return _html;
}

/**
 * viewjs预览大图
 */
function viewPic(){
    var galley = document.getElementById('galley');
    console.log("tetS");
    var viewer = new Viewer(galley, {
        url: 'data-original',
        hidden: function(){
            viewer.destroy();
        }
    });
    viewer.show();
}