## 1. 加载地图

## 2. 常用控件，继承 `TControl`的基本方法 
- 1) `TNavagationControl`
- 2) `TOverviewMapControl`
- 3) `TScaleControl`
- 4) `TCopyControl`
- 5) `TMapTypeControl`

## 3. 自定义控件需要调用 `THtmlElementControl` 类，继承 `TControl`

##　4. 覆盖物 
- 1) `TOverlay`类，叠加层类都直接或间接继承于此基类 
- 2) `TLabel`类 
- 3) `TMarker`类 
- 4) `TInfoWindow`类 
- 5) `TPolyline`类 
- 6) `TPolygon`类 
- 7) `TRect`类 
- 8) `TEllipse`类 
- 9) `TCircle`类

##　5. 事件 `TEvent`
- 1) `.addListener(source:Object,event:String,handler:Function)` //返回一个 `handle`
- 2) `.bind(source:Object,event:String,method:Function)` 
- 3) `.removeListener(handle:TEventListener)`   //通过 `handle`删除 
- 4) `.clearListener(source:Object || Node, event:String)`  //通过指定对象和指定事件 删除 
- 5) `.deposeNode(object:Object)` //删除指定节点及其子节点上注册的所有事件处理程序 
- 6) `.trigger(source:Object,event:String,args:Array)`  //触发 
- 7) `.getCallback(object:Object,method:Function)`  //返回调用指定对象上的方法的闭包 
- 8) `.TEvent.cancelBubble(event:String)`  //中止事件处理程序的执行以取消事件冒泡，并返回事件处理结果false  
- 9) `.returnTrue(event:String)` //同上，返回 `true`
？`addListener` 和 `bind`的区别

? `TEvent.bind(marker,'dragend',marker,function(lnglat){} )`
## 6. 地图图层  
- 6.1 自定义图层 （WMTS）`TTileLayer(opts:TTileLayerOptions)` 
  - 1) 参数：`isPng`,  `opacity`,  `tileUrlTemplate`,  `errorImg`,  `zIndex`,  `minResolution`,  `maxResolution`
  - 2) 方法： 
    `getObject()` 
    `dispose()` 
    `setGetTileUrl(function:Function)`: 设置取图函数 `(x,y,z)=>{ someurl+x+y+z;}` ,返回图片的路径 
    `getImg(x:Number,y:Number,z:Number)`: 返回块号对应的html对象(div 或者 image)
    `getAllImg()`: 返回包含所有image的一个对象 
- 6.2 WMS图层  `TTileLayerWMS(name,url,opts)`

## 7. 地图工具 
- 7.1 标注工具 `TMarkTool`
- 7.2 矩形工具 `TRectTool`
- 7.3 折线工具 `TPolylineTool`
- 7.4 多边形工具 `TPolygonTool`
- 7.5 圆形工具 `TCircleTool`
->点击按钮（按钮绑定js事件打开工具），打开工具，触发绑定的事件，通过 `draw,click`执行工具的操作，结束后。

## 8. 右键菜单 `TContextMenu`
- 1) `addItem()` 添加菜单项 => `TMenuItem`
- 2) `getItem()` 返回指定索引的菜单项，从0开始 
- 3) `removeItem()` 
- 4) `addSeparator()`  添加分隔符？ 
- 5) `removeSepartor()` 
- 6) `getItems()`   返回所有的TMenuItem，是数组 
- 7) `getAllSeparato()`   返回所有分隔线，是数组

## 9. 服务 
### 9.1 搜索(TLocalSearch): 位置搜索、周边搜索和范围检索 
- 1) `TLocalSearch`类方法 
  - 设置检索方式：可以根据检索词(`search(,)`),检索词+范围(`seachInBounds(,)`),检索词+中心点+半径(`searchNearby(,,)`)三种方式进行检索。
  - 设置检索类型：`setSpecifyAdminCOde()`或`setQueryType()` => 返回检索类型：getQueryType()
  - 检索结果及相关：`getResults()`, `gotoPage()`,`clearResults()`,`setSearchCompleteCallback()`
  - 页面设置：略
- 2) `TLocalSearchResult`类：表示`TLocalSearch`的检索结果，通过`TLocalSearch.getResults()`或`TLocalSearch`的`onSearchComplete`回调函数的参数得到。
### 9.2 公共交通路线
#### 9.2.1 公交路线规划(TTransitRoute)
- 1) 构造函数：`TTransitRoute(map:TMap,opts:TransitRouteOptions)`
- 2) `TTransitRoute`类的方法
  - 检索：`search(start:TLngLat,end:TLngLat)`
  - 返回最近一次的检索结果：`getResult()`,返回值为`TTransitRouteLine`类
  - 清除最近一次的检索结果：`clearResults()`
  - 设置路线规划策略：`setPolicy(policy:Num)`
  - 设置检索结束后的回调函数：`setSearchCompleteCallback(fun:Function)`
  - 返回状态码：`getStatus()`
- 3) 路线规划返回结果：`TTransitRouteResult`类的方法
  - 返回方案个数：`getNumPlans()`
  - 返回索引指定的方案：`getPlan(i:Num)`，返回值为`TTransitRouteLine`类，表示一条公交线路。
- 4) 路线规划方案：`TTransitRouteLine`类的方法
  - 返回线路类型：`getSegmentType()`
  - 返回起站点信息：`getStationStart()`、`getStationEnd()`
  - 返回线路内容：`getSegmentLine()`
#### 9.2.2 公交路线查询(TBusLineSearch)


