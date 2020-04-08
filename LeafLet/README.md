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

示例4：`geojson`

示例5：交互式地区分布图
&emsp;&emsp;通过geojson实现的（根据人口密度自定义颜色等级，鼠标悬浮时突出显示，自定义信息(鼠标移入与移出时都更新信息显示)、图例控件）。

实例6：图层组和图层控件(通过 `layergroup` 添加一堆`marker`)

实例7：缩放等级。
&emsp;&emsp;0级：256\*256，1级：256\*256\*4，以此类推，256*2<sup>n</sup>。
&emsp;&emsp;leaflet 在1.0.0 版本后的缩放等级可以是小数，需要使用 zoomSnap 可选项。(zoomDelta)

实例8：非地球的地图（比如游戏地图
&emsp;&emsp;miniZoom 可以是负的。地图单位和像素

实例9：WMS服务（Web Map Service)
&emsp;&emsp;L.tileLayer.wms()  对于 wms 服务的网址，可以现在类似 QGIS 的软件上查看有哪些图层。
&emsp;&emsp;L.tileLayer  -> tmw服务，网址请求相似，0.7版本用可选项 tms: true 标识，1.0 版本还可以用 -y 来标识。

实例10：panes，图层的组合
- 默认的顺序，1.0版本后可以自定义顺序：
  - TileLayers and GridLayers ， 图层
  - Paths, like lines, polylines, circles, or GeoJSON layers. 链接，覆盖物，geojson
  - Marker shadows，标记的阴影？
  - Marker icons，标记的图标
  - Popups，弹窗

实例11：网页上加载影像
&emsp;&emsp;和添加图片覆盖相似：L.videoOverlay(videoUrls,bounds,options); 
&emsp;&emsp;》》图片：L.imageOverlay(imageUrl,bounds,options);
&emsp;&emsp;控制视频的控件 L.Control.extend({onAdd: funciton(){}}) 
           或者： var pause = L.Control();    pause.onAdd = function(){  }
           需要在 vidio 初始化时创建两个按钮控件，
    两种创建控件的方式 ，L.Control.extend() 和 L.control();

实例12：扩展
  - 创建子类：`L.Class.extend()`
  ```js
    var MyDemoClass = L.Class.extend({
        myDemoProperty: 42, // 初始化值
        myDemoMethod: function(){ retuen this.myDemoProperty;}  // 方法
    });
    var myDemoInstance = new MyDemoClass();
    console.log(myDemoInstance.myDemoProperty); // 调用方法，返回初始值
  ```
  - 添加新的属性或方法，重新定义现有的属性或方法：`L.Class.include()`
  ```js
    MyDemoClass.include({
        _myPrivateProperty: 78, // 添加一个新的私有变量
        myDemoMethod： function(){return this._myPrivateProperty;} // 重新定义现有的方法
    });
    var mySecondDemoInstance = new MyDemoClass();
    console.log(mySecondDemoInstance.myDemoMethod());  // 被重新定义的方法
    conosle.log(mySecondDemoInstance.myDemoProperty); // 原有的属性
  ```
  - 类的构造：`L.Class.initialize()`
  ```js
  // 合并提供的选项
  var MyBoxClass = L.Class.extend({
      options:{
          width: 1,
          height: 1
      },
      initialize: function(name, options){
          this.name = name;
          L.setOptions(this, options);  // 合并提供的选项和该类的默认选项
      };
  });
  var instance = new MyBoxClass('Red',{width: 10});
  console.log(instance.name); // Red
  console.log(instance.options.width);  //10  （合并提供的选项）
  console.log(instance.options.height); //1
  // 添加可选项
  var MyCubeClass = MyBoxClass.extend({
      options: {
          depth: 1
      }
  });
  var instance = new MyCubeClass('Blue');
  console.log(instance.options.width);  // 1
  console.log(instance.options.height); / 1
  console.log(instance.options.depth);  // 1  (添加可选项)
  // 挂钩在类之后运行的初始化函数：addInitHook
  MyBoxClass.addInitHook(function(){
      // 子类会先运行父类的构造函数(initialize)，然后在运行自己的构造函数
      this._area = this.options.width * this.options.length; 
  })
  // addInitHook 的备用语法?
  MyCubeClass.include({
      // 添加一个新的方法
      _calculateVolume: function(arg1,arg2){
          this._volume = this.options.width * this.options.length * this.options.depth;
      }
  })
  MyCubeClass.addInitHook('_calculateVolume', argValue1, argValue2);
  ```
  - 调用父类的方法：`Function.call(...)`
  ```js
    L.FeatureGroup = L.LayerGroup.extend({
        addLayer: function(layer){
            //...
            L.LayerGroup.prototype.addLayer.call(this,layer); // 通过进入父类的原型
        },
        removeLayer: function(layer){
            //...
            L.LayerGroup.prototype.removeLayer.call(this.layer);
        }
    });
    // 调用父类的构造函数： ParentClass.prototype.initialize.call(this, ...)
    // 关于原型：
  ```
    