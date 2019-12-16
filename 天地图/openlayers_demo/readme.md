1. 加载地图

2. 常用控件，继承 TControl的基本方法
    1). TNavagationControl
    2). TOverviewMapControl
    3). TScaleControl
    4). TCopyControl
    5). TMapTypeControl
3. 自定义控件需要调用 `THtmlElementControl` 类，继承 TControl

4. 覆盖物
    1). TOverlay 类，叠加层类都直接或间接继承于此基类
    2). TLabel 类
    3). TMarker 类
    4). TInfoWindow 类
    5). TPolyline 类
    6). TPolygon 类
    7). TRect 类
    8). TEllipse 类
    9). TCircle 类

5. 事件 TEvent
    1) .addListener(source:Object,event:String,handler:Function) //返回一个 handle
    2) .bind(source:Object,event:String,method:Function)
    3) .removeListener(handle:TEventListener)   //通过 handle 删除
    4) .clearListener(source:Object || Node, event:String)  //通过指定对象和指定事件 删除
    5) .deposeNode(object:Object) //删除指定节点及其子节点上注册的所有事件处理程序
    6) .trigger(source:Object,event:String,args:Array)  //触发
    7) .getCallback(object:Object,method:Function)  //返回调用指定对象上的方法的闭包
    8) .TEvent.cancelBubble(event:String)  //中止事件处理程序的执行以取消事件冒泡，并返回事件处理结果false 
    9) .returnTrue(event:String) //同上，返回 true
？addListener 和 bind 的区别

? TEvent.bind(marker,'dragend',marker,function(lnglat){} )
6. 地图图层 
    1.1 自定义图层 （WMTS）TTileLayer(opts:TTileLayerOptions)
        1) 参数：isPng, opacity, tileUrlTemplate, errorImg, zIndex, minResolution, maxResolution
        2) 方法：
            getObject()
            dispose()
            setGetTileUrl(function:Function): 设置取图函数 (x,y,z)=>{ someurl+x+y+z;} ,返回图片的路径
            getImg(x:Number,y:Number,z:Number): 返回块号对应的html对象(div 或者 image)
            getAllImg(): 返回包含所有image的一个对象
    1.2 WMS图层  TTileLayerWMS(name,url,opts)

7. 地图工具
    1.1 标注工具 TMarkTool

    


