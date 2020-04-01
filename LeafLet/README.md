# webgis-demo [主页](https://linxiaoki.github.io/webgisDemo)：
- [leaflet demo1](https://linxiaoki.github.io/webgisDemo/LeafletDemo1/):基于Leaflet实现台风实时路径渲染。
- [OpenLayers Demo](https://linxiaoki.github.io/webgisDemo/openlayersDemo/)

### Leaflet - 链式调用 - [api参考文档](https://leafletjs.com/reference-1.6.0.html#marker)
#### 展示地图

##### 地图初始化
`var mymap = L.map('mapid').setView([51.505, -0.09], 13);  //中心点和缩放系数` 

##### 图层叠加
```
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",{
        id: 'mapbox/streets-v11',
        accessToken: 'your-access-token',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
    })
```
问题： 关于 zoomOffset 是什么？  tiles/{tilesize}   和  tileSize的关系是？[mapbox api网址](https://docs.mapbox.com/api/maps/#retrieve-raster-tiles-from-styles)
关于zoomOffset，默认是0。因为api返回的瓦片是 512\*512，leaflet 默认是 256\*256，所以需要 zoomOffset 改为 -1 ？ 图片的 z-1》
id 这个参数该怎么填：参考[mapbox docs/ styles id](https://docs.mapbox.com/help/glossary/style-id/)

[mapbox 地图API文档](https://docs.mapbox.com/api/maps/#static-tiles)

#### 图层
生成图层后添加： L.tileLayer( ).addTo(map);  或者初始化地图时添加： L.map('map'{.....,layers: [  ,  ,   ]})
##### geojson
```js
// 注意：坐标是 经度(lng)，纬度(lat)，和 leaflet默认的相反
type,properties,geometry:{type,coordinates}   
初始化： L.geoJSON(geojsonFeature).addTo(map);  
  或者： L.geoJSON().addData(geoGeature).addTo(map);
```

点的处理: pointToLayer
> 点的处理与折线和多边形不同。默认情况下，为GeoJSON点绘制简单标记。我们可以通过在创建GeoJSON层时在GeoJSON选项对象中传递一个pointToLayer函数来改变这一点。这个函数被传递一个LatLng并返回一个ILayer的实例，在这种情况下可能是一个标记或CircleMarker。

onEachFeature(feature,layer)    （每个feature都执行一遍的函数）,
filter(feature,layer)     （返回 true 则添加）


设置样式
```js
// 第一种
{
    style: function(feature){
        // 可以通过 feature 写 switch 语句
        return {"color": "red"}
    }
}
// 第二种，没啥用
{
    style: {"color": "red"}
}
// 第三种
{"color": "red"}

```

##### 图层组 layerGroup
- 一次只能显示一个基本图层（radioButton）
- 覆盖层可以显示多个（checkBox）


#### 覆盖物：标注，矢量图形元素，信息窗口
```js
L.marker/circle/polygon(坐标，样式).addTo(地图)
.bindPopup(一些话，可以识别html标签).openPopup()

// openOn(地图)会关闭之前已经弹出的窗口, addTo(地图) 则不会关闭。
L.popup().setLatLng(坐标).setContent(内容).openOn(地图)
```


#### 控件
```js
ctrol = L.control();
ctrol.onAdd = function(){ return this._div};s
ctrol.update = function(props){ this._thiv.innerHTML='' };
ctrol.update(props);
```

#### 事件（触发Js事件）
[Api reference: Evented](https://leafletjs.com/reference-1.6.0.html#evented)
```
map.on('click',函数内容)  
map.off('click')
```

#### 地图工具（标注，绘制（画矩形、圆），测距，测面）


#### 右键菜单


#### 服务


#### 其他



#### [教程](https://leafletjs.com/examples.html)
示例1：展示地图
示例2：手机端展示，html页面的meta标签需要禁止滑动。定位失败(没科学上网？)。
示例3：自定义图标，有阴影（)
    ```
    L.Icon.extend({options:{key:value}}   //扩展新的图标生成方法
    L.icon({key:value})         // 返回定义的图标
    ```

示例4：geojson
示例5：交互式地区分布图
通过geojson实现的（根据人口密度自定义颜色等级，鼠标悬浮时突出显示，自定义信息(鼠标移入与移出时都更新信息显示)、图例控件）。
实例6：图层组和图层控件(通过 layergroup 添加一堆marker)
