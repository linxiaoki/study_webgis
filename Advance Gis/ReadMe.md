[Advance GIS 教程网址](http://gis.yohman.com/up206b/tutorials/)
1. create **map**,add **marker** and **infowindow**

    ```
    map:  new google.maps.Map($('#map_canvas'),options1)
        options:位置(LatLng),缩放级别(Zoom),[地图类别(mapTypeId)]
            LatLng:  new google.maps.LatLng  
            mapTypeId:[ROADMAP]|[SATELLITE]|[HYBRID]
    marker=new google.maps.Marker(options2)
        option: postion,map,title
            postion: LatLng
            map:
            title:  [text]
    infowindow=new google.maps.InfoWindow(options3)
        options:content
            content: [text]
    google.maps.event.addListener(marker,'click',function(){
        infowindow.open(map,marker);
    });
    task: (1) 添加多个marker  (2) 更改marker图标
    ```
    
2. Add more Marker </br>
   创建js以解决重复造轮子。
   - 创建单个标记
   ```
   var myLatlng=new google.maps.LatLng(34,-118);
   var marker=new google.maps.Marker({
       position:myLatlng,
       map;map,
       title:"Santa Monica"
   })
   ```
  - 自定义函数，创建多个标记
  ```
    funciton createMarker(latitude,longitude,title){
        var markerLatLng = new google.maps.LatLng(latitude,longitude);
        var marker = new google.maps.Marker({
            position: markerLatLng,
            map: map,
            title: title
        });
    }
    createMarker(34.01,-118,'Santa Monica');
    creaetMarker(34.02,-118,'culver city');
  ```
3. Buffer/Circle 缓冲区
[开发文档-添加圆形](https://developers.google.com/maps/documentation/javascript/shapes#circle_add)
```
var bufferOptions={
    
};
var cityCircle = new google.maps.Circle(bufferOptions);
```

2.1 Javascript 函数：创建命名空间
** 函数默认在'global'命名空间中，为了避免函数名与别人混淆，需要自定义命名空间 **
```
#自定义 命名空间 kass
var kass={}
#在命名空间 kass 下定义函数
kass.holleworld=function(yourname){
    console.log(yourname+",hello world!");
};
#使用函数
kass.helloworld('kass')
```
2.3 在谷歌地球中创建内容，并将其带入google地图
  - 在Google地球编辑图层
  - 图层导出为 KMZ 文件，上传到网站空间，使其可通过链接引用
  - 使用 KMZ 链接
  ```
  var UCLAparking;
  UCLAParking=new google.maps.KmlLayer('http://domain.com/kml/UCLAParking.kmz?dummy='+(new Date()).getTime());
  UCLAParking.setMap(map);
  // dummy 参数的作用
  // 当你加载一次kml,google会缓存kml，当你下载请求时会自动加载缓存而不是最新的kml文件
  //所以在URL上添加一个伪参数 dummy，确保 URL 唯一。
  ```
2.4  CSS:布局方案
- 固定地图大小
    ```
    div[style='width:800;margin:auto']
        h1{UCLA Parking Structures}
        div#map_canvas[style=width:800px;height:600px]
        div{Welcome！.........}
    ```
    ![img](https://ws1.sinaimg.cn/mw690/005zbIM7ly1g1a8rbzdtnj307u061jsz.jpg)
- 2列布局
    ```
    div[style=position:absolute;width:230px;height:100%;overflow:auto;float:left;padding-left:10px;padding-right:10px;]
        h1{UCLA Parking Structures
    div#map_canvas[style=height:100%;margin-left:250px]
    ```

3.01 Infowindows
实现一次只打开一个窗口
- 原来的代码:create_marker,create_infowindow,bind_marker-infowindow
```
var yoh={};
yoh.createMarker=function(){
    var markerLatLng=new google.maps.LatLng(latitude,longitude);
    var marker=new google.map.Marker({
    
        position:markerLatLng,
        map:map,
        title:title
    });
    var infowindow = new google.maps.InfoWindow({
        content:contentString
    });
    google.maps.event.addListener(marker,'click',funciton(){
       infowindow.open(map,marker); 
    });
};
```
- 更改后的代码
```
var yoh={};
var infowindow=new google.maps.InfoWindow();

yoh.createMarker=function(latitude,longitude,title,contentString){
    var markerLatLng = new google.maps.LatLng(latitude,longitude);
    var marker = new google.maps.Marker({
        position: markerLatLng,
        map: map,
        title: title
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map,marker);
    });
}
```
3.02 KML 是否指定缩放级别与位置
```
// Google Maps API 再添加 kml 图层后，默认自动缩放到 kml 对象的范围。(而不是指定的缩放级别和经纬度)
var myKML;
myKML=new google.maps.KmlLayer('http://domain/kml/damage.kmz',{preserveViewport:true});
myKML.setMap(map);
```

3.2 Metro Web - Using jQuery to display route data
```
https://developer.metro.net/
http://api.metro.net/agencies/lametro/routes?callback=?
#数据格式  路线的？
{"items":[{"dispaly_name":"name?","id":2},{"display_name":"","id":},{,},...]}
```
- 通过JSONP请求**获取数据**
```
//添加在全局函数中
function trace(message){
    console.log(message);
}
// 添加在初始化函数中
yoh.getBusRoutes = function(){
    $.getJSON("http://api.metro.net/agencies/lametro/routes?callback=?",functon(data){
        trace(data);
    });
}
```
- 遍历取出数据
```
//更改函数
getBusRoutes
    $.getJSON("http://api.metro.net/agencies/lametro/routes?callback=?",function(data){
        $.each(data.items,function(i,item){
            trace(item.display_name);
        });
    });
}
```
- 展示在左侧框
```
//左侧添加 DIV 元素
div#stoplist
//更改函数
getBusRoutes
    getJSON,function()
        $.each(data,items,function(){
            $("#toplist").append(item.display_name+"</br>")
        });
```
3.3 映射公交车站位置
```
http://api.metro.net/agencies/lametro/routes/704/sequence
#数据格式
{items:[{"longitude":114,"latitude":34,"display_name":"name1",id:""},{},{},...]}
```
- 获取位置数据 
```
yoh.mapBusStops=function(busnum){
    $.each(data.items,function(i,item){
       trace(i+':'+item.display_name);
       trace(item.latitude);
       trace(item.longitude);
    });
}
```
- 地图上显示
```
var busstop=[];  //global var
yoh.createStop=function(i,latitude,longitude,title){
    var markeLatLng=new google.maps.LatLng(latitude,longitude);
    busstop[i]=new google.maps.Marker({
        position:markerLatLng,
        map:map,
        title:title
    });
}

yoh.mapBusStops=function(busnum){
    $.getJSON("http://api.metro.net/agencies/lametro/routes/"+busnum+"/sequence?callback=?",function(data){
        $.each(data.items,function(i,item){
            yoh.createStop(i,item.latitude,item.longitude,item.display_name);
        });
    });
}
```
3.4 自动缩放以显示公交车站位置-使用"bounds"
```
define    new    extend all
-----------
var bounds;        //define
yoh.mapBusStops=function(busnum){
    bounds = new google.maps.LatLngBounds();    //new bounds
    $.getJSON....function
        each
            createStop()
}
yoh.createStop=function(i,latitude,longitude,title){
    var markerLatLng=new ;
    bounds.extend(markerLatLng);  // extend
    map.fitBounds(bounds);
    busstop[i]=
}
```

3.5 更改默认地图图标

[mapicon素材](http://mapicons.nicolasmollet.com/)
查找图标,右键保存,url引用
```
busstop[i]=new google.maps.Marker({
    position:markerLatLng,
    map:map,
    title:title,
    icon:'http://www.yohman.com/students/yoh/images/bus.png...'
})
```

3.6 点击左侧链接，动态映射每条路线</n>

```
div#toplist 增加链接  yoh.mapBusstops(  )
-----------------------
$('#stoplist').append('<a onclick="up206b.mapBusStops('+item.id+')" href="javascript:void(0)">'+item.id+'</a> ');
```

3.7 removing routes
```
something.setMap(map);  //添加一些东西(标记，线，多边形，圆，KMl图层)
something.setMap(null);  // 关闭一些东西
```
由于点击左侧的链接，公交车站图标会一直在地图上，所以需要在每次点击前移除图标。

3.9 bus 实时 </br>
返回的json 数据为空。。。。暂停(可能因为时差问题，现在那边是深夜)
```
http://api.metro.net/agencies/lametro/routes/704/vehicles/
``` 


```
livebus[i] = new google.maps.Marker({
    position: markerLatLng,
    map: map,
    title: title,
    icon: 'http://www.yohman.com/students/yoh/images/livebus.png',
    zIndex: 2000
});
```

