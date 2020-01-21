//app.js
var map;

function onLoad() {
    var zoom = 10;
    map = new TMap("mapDiv", {
        projection: "EPSG:4326"  //900913  或  4326
    });

    map.centerAndZoom(new TLngLat(118.7912, 32.061), zoom);  //116.40969,39.89945  北京，可以搜索天安门？
    map.enableHandleMouseScroll(); // 启用滚轮缩放
    map.enableContinuousZoom(); // 启用缩放的效果
    map.enableDoubleClickZoom(); // 双击放大

    //⊙⊙ 控件  control
    {
        // 添加一组控件
        addControls();

        // 自定义控件1 - 地图类型选择
        jQuery('#mapTypeSelect').on("change", switchingMapType); // 添加 change 事件
        var mapTypeControl = new THtmlElementControl(jQuery("#mapTypeStyle")[0]);
        mapTypeControl.setLeft(90);
        mapTypeControl.setTop(60);
        map.addControl(mapTypeControl);

        // 自定义控件2 - 地图缩放
        jQuery("#zoomIn").click(() => {
            map.zoomIn();
        })
        jQuery("#zoomOut").click(() => {
            map.zoomOut();
        })
        var zoomControl = new THtmlElementControl(document.getElementById("mapZoom"))
        zoomControl.setLeft(220);
        zoomControl.setTop(60);
        map.addControl(zoomControl)
    }

    //⊙⊙ 覆盖物 overlay - button:编辑多段线、marker+label、聚合marker
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
        jQuery(jQuery("div#lineEditControl>input")[0]).click(() => line.enableEdit());
        jQuery(jQuery("div#lineEditControl>input")[1]).click(() => line.disableEdit());

        // 给 marker 添加 label
        addMarkerAndInfo(new TLngLat(118.46125, 32.072), "自定义信息1：");
        addMarkerAndInfo(new TLngLat(118.46125, 32.172), "2:获取坐标：");

        // 聚合marker：加载大量 marker
        // addMarkerClusterer(200);
        jQuery("div>button#showMarkerClusterer").click(() => {
            addMarkerClusterer(200);
        });
    }

    //⊙⊙ 事件 event
    {
        // addMapClick();   // click  注册点击事件
        // addMapMoveend();  // moveend  拖拽事件
        addMapMousemove();  // mousemove  鼠标悬浮移动事件
    }


    //⊙⊙ 图层: 添加自定义图层 ， 添加 wms 图层
    {
        // 添加自定义图层 wmts? ，需要设置正确的坐标系：900913<<<<<<
        var tile_config = { opacity: 0.4 };
        var tk = "7a1d904db1ad0e570a1b0afc5eab78c4";
        /*
        tile_config.getTileUrl = (x,y,z)=>{
            return "http://t0.tianditu.gov.cn/img_w/wmts?"+"SERVICE=WMTS&REQUEST=GetTile"+
            "&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles"+
            "&TILECOL="+ x +"&TILEROW="+ y + "&TILEMATRIX="+ z + "&tk="+tk;
        };*/
        var layer = new TTileLayer(tile_config); //创建自定义图层对象
        layer.setGetTileUrl((x, y, z) => {
            return "http://t0.tianditu.gov.cn/img_w/wmts?" + "SERVICE=WMTS&REQUEST=GetTile" +
                "&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
                "&TILECOL=" + x + "&TILEROW=" + y + "&TILEMATRIX=" + z + "&tk=" + tk;
        });  // 设置取图函数，pdf 是在 config 里面也添加了 setGetTileUrl，不过好像不加也不影响。
        if (map.getCode() == "EPSG:900913") { // 坐标系为墨卡托投影才可显示地图
            map.addLayer(layer);
        }

        // 添加 wms 图层,  
        jQuery("div#wmstool").click((ev) => {
            // 使用 事件委托
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if (map.getCode() != "EPSG:4326") { //需要设置正确的坐标系： 4326 <<<<<<<<<<<<
                return;
            }
            if (target.nodeName.toLocaleLowerCase() == "input") {
                switch (target.defaultValue) {
                    case "叠加超图WMS服务图层":
                        addSuperMapLayer('China', 'http://support.supermap.com:8090/iserver/services/map-china400/wms111/China');
                        break;
                    case "删除超图WMS服务图层":
                        map.removeLayer(wmsLayer);
                        break;
                }
                //;
            }
        });
    }

    //⊙⊙ 工具
    {
        addTools();
        // 触发：矩形工具打开
        jQuery("div#rectTool").click((ev) => {
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if (target.nodeName.toLocaleLowerCase() == "input") {
                switch (target.defaultValue) {
                    case "开启":
                        rectTool.open();
                        break;
                    case "关闭":
                        rectTool.close();
                        break;
                    case "清除":
                        //rectTool.clear();   // 没用？
                        map.removeOverLay(rectOverlay);
                        break;
                }
            }
        });
        // 触发：折线工具打开
        jQuery("div#lineTool").click((ev) => {
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if (target.nodeName.toLocaleLowerCase() == "input") {
                switch (target.defaultValue) {
                    case "开启":
                        lineTool.open();
                        break;
                    case "关闭":
                        lineTool.close();
                        break;
                    case "清除":
                        lineTool.clear();
                        break;
                }
            }
        });
        // 触发：标注工具打开
        jQuery("div#markerTool").click((ev) => {
            // addListener()
            // bind()
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if (target.nodeName.toLocaleLowerCase() == 'input') {
                switch (target.defaultValue) {
                    case "开启":
                        markerTool.open();
                        break;
                    case "关闭":
                        markerTool.close();
                        break;
                    case "编辑":
                        if (marker == null) {
                            alert('请先画点');
                            return;
                        } else {
                            marker.enableEdit();
                            //bind: 一直生效？
                            var listener = TEvent.bind(marker, 'dragend', marker, function (lnglat) {
                                TEvent.removeListener(listener);
                                alert("当前坐标：" + lnglat.getLng() + "," + lnglat.getLat());
                            })
                            /*//addListener: 拖拽一次后失效?
                            var listener=TEvent.addListener(marker,"dragend",(lnglat)=>{
                                TEvent.removeListener(listener);
                                alert("当前坐标："+lnglat.getLng()+","+lnglat.getLat());
                            })*/
                        }
                        break;
                }

            }
        });
        // 触发：多边形工具打开
        jQuery("div#polygonTool").click((ev) => {
            var ev = ev || window.event;
            console.log("test window event");
            console.log(window.event);
            var target = ev.target || ev.srcElement;
            if (target.nodeName.toLocaleLowerCase() == "input") {
                switch (target.defaultValue) {
                    case "开启":
                        polygonTool.open();
                        break;
                    case "关闭":
                        polygonTool.close();
                        break;
                }
            }
        });
        // 触发：圆形工具打开
        jQuery("div#circleTool").click((ev) => {
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if (target.nodeName.toLocaleLowerCase() == "input") {
                switch (target.defaultValue) {
                    case "开启":
                        circleTool.open();
                        break;
                    case "关闭":
                        circleTool.close();
                        break;
                }
            }
        })
    }

    //⊙⊙ 右键菜单
    {
        var menu = new TContextMenu();  // 创建右键菜单对象
        var txtMenuItems = [
            {
                text: '放大',
                callback: () => { map.zoomIn() }
            }, {
                text: '缩小',
                callback: () => { map.zoomOut() }
            }, {
                text: '放置到最大级',
                callback: () => { map.setZoom(18) }
            }, {
                text: '查看全国',
                callback: () => { map.setZoom(4) }
            }, {
                text: '查看当前坐标',
                isDisable: false,
                callback: (lnglat) => { alert(lnglat.getLng() + "," + lnglat.getLat()); }
            }
        ];
        txtMenuItems.forEach((txtmenuItem, index) => {
            //var options = new TMenuItemOptions();
            //options.width = 100;
            menu.addItem(new TMenuItem(txtmenuItem.text, txtmenuItem.callback, { width: 100 }));
            if (index == 1 || index == 3) {
                menu.addSeparator(); // 创建分隔线
            }
        });
        map.addContextMenu(menu);
    }

    //⊙⊙ 服务-搜索
    {
    var config = {
        pageCapacity: 10,
        onSearchComplete: localSearchResult //接收数据的回调函数 
    };
    localsearch = new TLocalSearch(map, config); // 创建搜索对象
    // 自定义搜索控件
    var searchControl = new THtmlElementControl(jQuery("div#search_tool")[0]);
    searchControl.setRight(20);
    searchControl.setTop(20);
    map.addControl(searchControl);
    // html 按钮绑定事件
    jQuery("div.search>input[type=button]").click(function(){
        localsearch.search(jQuery("div.search>input#keywords").val()); // 搜索
    });
    jQuery(jQuery("div#resultDiv>div#pageDiv>input")[0]).click(()=>{
        localsearch.firstPage(); // 第一页
    });
    jQuery(jQuery("div#resultDiv>div#pageDiv>input")[1]).click(()=>{
        localsearch.previousPage(); // 上一页
    });
    jQuery(jQuery("div#resultDiv>div#pageDiv>input")[2]).click(()=>{
        localsearch.nextPage();  // 下一页
    });
    jQuery(jQuery("div#resultDiv>div#pageDiv>input")[3]).click(()=>{
        localsearch.lastPage();  // 最后一页
    });
    jQuery(jQuery("div#resultDiv>div#pageDiv>input")[5]).click(()=>{
        localsearch.gotoPage(parseInt(jQuery("div#pageDiv>input#pageId").val()));  // 转到 n 页
    });


    // 接收数据的回调函数
    function localSearchResult(result) {
        clearAll();  // 清空地图及搜索列表
        console.log(result);
        console.log("query type:",result.getResultType());
        addPromptHtml(result); // 添加提示词（在 #promptDiv 节点上）
        // 1: 普通搜索，2：视野内搜索，3：普通建议词搜索
        // 4：普通建议词搜索，5：公交规划建议词搜索
        // 7：纯POI搜索(排除公交线)
        switch (parseInt(result.getResultType())) {
            case 1:
                // 解析点数据结果
                pois(result.getPois());
                break;
            case 2:
                // 解析推荐城市
                statistics(result.getStatistics())
                break;
            case 3:
                // 解析行政区划边界
                area(result.getArea());
                break;
            case 4:
                // 解析建议词信息
                suggests(result.getSuggests());
                break;
            case 5:
                // 解析公交信息
                lineData(result.getLineData());
                break;
        }
        // 清空地图及搜索列表
        function clearAll(){
            map.clearOverLays();
            document.getElementById("searchDiv").innerHTML="";
            document.getElementById("resultDiv").style.display="none";
            document.getElementById("statisticsDiv").innerHTML="";
            document.getElementById("statisticsDiv").style.display="none";
            document.getElementById("promptDiv").innerHTML="";
            document.getElementById("promptDiv").style.display="none";
            document.getElementById("suggestsDiv").innerHTML="";
            document.getElementById("suggestsDiv").style.display="none";
            document.getElementById("lineDataDiv").innerHTML="";
            document.getElementById("lineDataDiv").style.display="none";
        }

        //在 #promptDiv 节点上 添加提示词
        function addPromptHtml(obj) {
            //var prompts = obj.getPrompt(); // 返回提示信息
            var prompts=obj.getPrompt();
            if (prompts) {
                var promptHtml = "";
                for (var i = 0; i < prompts.length; i++) {
                    /**prompt 结构
                     * 
                     * {
                     *   "keyword": "~",
                     *   "admins":[{"name":"中国"//行政区范围,"adminCode":"156000000"//行政区代码}],
                     *   "type": 2
                     * }
                     * type=1 时，一般提示为"是否在XXX搜索名称含XXX的结果" (搜索更多)
                     * type=2 时，一般提示为"在 XXX 没有搜索到相关的结果"  (没有结果，查找其他)
                     * type=3 时，一般会列出查询的多个结果，点击结果即可完成行政区跳转 (列出结果)
                     */
                    var prompt = prompts[i];
                    var promptType = prompt.type;
                    var promptAdmins = prompt.admins;

                    var meanprompt = prompt.DidYouMean;
                    if(promptType==1){
                        promptHtml +=`<p>您是否要在<strong>${promptAdmins[0].name}</strong>搜索更多包含<strong>${obj.getKeyword()}</strong>的相关内容？</p>`;
                    }else if(promptType==2){
                        promptHtml+=`<p>在<strong>${promptAdmins[0].name}</strong>没有搜索到与<strong>${obj.getKeyword()}</strong>相关的结果。</p>`;
                        if(meanprompt){// 自定义弹出的？ did you mean prompt: 没有找到提供搜索建议?
                            console.log("meanprompt 有值>>>>>>");
                            promptHtml+=`<p>您是否要找：<font weight='bold' color='#035fbe><strong>${meanprompt}</strong></font></p>`;
                        }
                    }else if(promptType==3){
                        promptHtml+=`<p style='margin-bottom:3px;'>有以下相关结果，您是否要找：</p>`
                        for(i=0;i<promptAdmins.length;i++){
                            promptHtml+=`<p>${promptAdmins[i].name}</p>`;
                        }
                    }
                }
                if(promptHtml != ""){
                    console.log(promptHtml);
// !!!之后再改 $("#promptDiv")
                    document.getElementById("promptDiv").style.display="block";
                    document.getElementById("promptDiv").innerHTML=promptHtml
                }else{
                    console.log("promptHtml == ''",promptHtml);
                }
            }
        }
        
        // 解析点数据结果
        function pois(pts) {
            if(pts){
                var divMarker=document.createElement("div")
                var pointArr=[]; //坐标数组，设置最佳比例尺会用到
                // 源码里面是在for循环内使用闭包，为了每个点都执行函数，用 arr.forEach 替代
                pts.forEach((ptItem,index)=>{
                    var name = ptItem.name; //名称
                    var address = ptItem.address; // 地址
                    var lnglatArr = ptItem.lonlat.split(" "); // 坐标
                    var lnglat = new TLngLat(lnglatArr[0],lnglatArr[1]);
                    pointArr.push(lnglat);
                    // 地图上添加标注点，并注册点击事件
                    var marker = new TMarker(lnglat);
                    map.addOverLay(marker);
                    // 原为：bind(marker,'click',marker,function(){})  
                    // bind 多了一个参数marker,是因为 marker[1] 注册'click'事件；marker[2] 执行function，并且 this 指向 marker[2] 吗？
                    TEvent.addListener(marker,'click',function(){
                        var info = this.openInfoWinHtml("地址"+address);
                        info.setTitle(name);
                    });
                    // 页面显示搜索到列表
                    var a = document.createElement("a");
                    //a.href="javascript://";
                    a.innerHTML=name;
                    a.onclick=function(){
                        // 显示信息框
                        var info = marker.openInfoWinHtml("地址"+address);
                        info.setTitle(name);
                    };
                    divMarker.appendChild(document.createTextNode((index + 1)+"."));
                    divMarker.appendChild(a);
                    divMarker.appendChild(document.createElement("br"));0
                })

                // 显示地图的最佳级别
                map.setViewport(pointArr);
                //显示搜索结果
                divMarker.appendChild(document.createTextNode(` 共${localsearch.getCountNumber()
                }条记录，分${localsearch.getCountPage()}页，当前第${localsearch.getPageIndex()}页`));
                document.getElementById('searchDiv').appendChild(divMarker);
                document.getElementById('resultDiv').style.display="block";
            }
        }

        // 解析推荐城市
        function statistics(obj) {
            if(obj){
// pointArr 没用？
                var priorityCityHtml="";
                var allAdminsHtml="";
                console.log(">>>>>>>");
                console.log(obj);
                console.log(priorityCitys);
                var priorityCitys = obj.priorityCitys;
                if(priorityCitys){
                    //推荐城市显示
                    priorityCityHtml += "在中国以下城市有结果<ul>";
                    priorityCityHtml += priorityCitys.map((city)=>{
                        return `<li>${city.name}(${city.count})</li>`
                    }).join("");
                    priorityCityHtml+="</ul>";
                }
                var allAdmins = obj.allAdmins;
                if(allAdmins){
                    // function  jQuery('div#statisticsi>ul#readmore').slideToggle('slow');
                    allAdminsHtml +=`<a onclick=function(){}>更多城市</a><ul id='readmore'>`; //  可以添加一个动作 slideup/slidedown, 现实和隐藏
                    for(var i=0;i<allAdmins.length;i++){
                        allAdminsHtml+=`<li>${allAdmins[i].name}(${allAdmins[i].count})`;
                        // childAdmins  省里面的市？
                        var childAdmins = allAdmins[i].childAdmins;
                        allAdminsHtml+=childAdmins?childAdmins.map((childadmin_item)=>{
                            return `<blockquote>${childadmin_item.name}(${childadmin_item.count})</blockquote>`;
                        }).join(""):""+"</li>";
                    }
                    allAdminsHtml+="</ul>"
                    
                }
                document.getElementById("statisticsDiv").style.display="block";
                document.getElementById("statisticsDiv").innerHTML=priorityCityHtml+allAdminsHtml;
            }
        }
 
        // 解析行政区划边界
        function area(obj) {
            if(obj){
                var pointArr=[];
                var points=obj.points;
                for(var i=0;i<points.length;i++){
                    var regionLngLats = [];
                    var regionArr = points[i].region.split(",");
                    for(var j=0;j<regionArr.length;j++){
                        var lnglat=new TLngLat(regionArr[j].split(" ")[0],regionArr[j].split(" ")[1]);
                        regionLngLats.push(lnglat);
                        pointsArr.push(lnglat);
                    }
                    // 创建线对象
                    var line = new TPolyline(regionLngLatss,{
                        strokeColor: "blue",
                        strokeWeight: 3,
                        //strokeOpacity: 1,
                        strokeStyle: "dashed"
                    });
                    // 向地图上添加线
                    map.addOverLay(line);
                    // 显示最佳比例尺
                    map.setViewport(pointsArr);
                }
            }   
        }

        // 解析建议词信息
        function suggests(obj){
            if(obj){
                // 建议词提示，如果搜索类型为公交规划建议词(type=?5?)或公交站(type=?7?)搜索时，返回结果为公交信息的建议词
                var suggestsHtml="建议词提示<ul>"+obj.map((suggest_item)=>{
                    return `<li>${suggest_item.name}&nbsp;&nbsp;<font style="color:#666666">${suggest_item.address}</font></li>`
                }).join("")+"/ul";
                document.getElementById("suggestsDiv").style.display="block";
                document.getElementById("suggestsDiv").innerHTML=suggestsHtml;
            }
        }

        // 解析公交信息
        function lineData(obj){
            if(obj){
                //公交提示
                var lineDataHtml ="公交提示<ur>"+obj.map((station)=>{
                    return `<li>${station.name}+&nbsp;%nbsp;<font style="color:#666666">共${station.stationNum}站</font></li>`;
                }).join("")+"/ul";
                document.getElementById("lineDataDiv").style.display="block";
                document.getElementById("lineDataDiv").innerHTML=lineDataHtml;
            }
        }
    }
    }
}



//⊙⊙ 以下是调用的方法

// 控件
function addControls() {
    var navigation_control = new TNavigationControl({
        type: "TMAP_NAVIGATION_CONTROL_LARGE",
        anchor: "TMAP_ANCHOR_TOP_RIGHT",
        offset: [30, 50],
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
    points1.push(new TLngLat(118.69123, 32.066));
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
function addMarkerAndInfo(lnglat_, text) {
    var marker = new TMarker(lnglat_);
    var customerInfoLabel = new TLabel({
        position: lnglat_,
        offset: TPixel(0, 0)
    });

    map.addOverLay(marker);
    TEvent.addListener(marker, "click", function(){
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
        customerInfoLabel.getObject().style.zIndex = 10000;
        map.addOverLay(customerInfoLabel);

        var obj = customerInfoLabel.getObject();   // label 的 宽，高
        var width = parseInt(obj.offsetWidth);
        var height = parseInt(obj.offsetHeight);
        var anchor_icon = this.getIcon().getAnchor();  // marker 图标的 宽，高
        var pixel = new TPixel(width / -2, height / -2 - anchor_icon[1]);
        customerInfoLabel.setOffset(pixel);

        jQuery("span#labelClose" + timestamp).click(() => {  // 在 addOverLay 后，绑定关闭的事件
            map.removeOverLay(customerInfoLabel);
        });
    }); 
}

// 聚合Marker
function addMarkerClusterer(MAX) {
    map.centerAndZoom(new TLngLat(118.7912, 32.061), 5);
    var markers = [];
    for (var i = 0; i < MAX; i++) {
        var lnglat = new TLngLat(Math.random() * 40 + 85, Math.random() * 30 + 21);
        markers.push(new TMarker(lnglat));
    }
    var markerCluster = new TMarkerClusterer(map, {
        markers: markers
    });

}


// 注册和移除点击事件  (弹出对话框，内容为点击坐标)
var mapclick;
function addMapClick() {
    removeMapClick();
    mapclick = TEvent.addListener(map, "click", function (p) {
        var lnglat = map.fromContainerPixelToLngLat(p);
        alert(lnglat.getLng() + "," + lnglat.getLat());
    });
}
function removeMapClick() {
    TEvent.removeListener(mapclick);
}

// 注册和移除地图拖拽事件 (弹出对话框，内容为拖拽后中心点的坐标)
var mapmoveend;
function addMapMoveend() {
    removeMapMoveend();
    mapmoveend = TEvent.addListener(map, "moveend", function (lnglat) {
        alert(lnglat.getLng() + "," + lnglat.getLat());
    });
}
function removeMapMoveend() {
    TEvent.removeListener(mapmoveend);
}

// 注册和移除地图滑动事件: 鼠标移动显示当前坐标
var mapmousemmove;
function addMapMousemove() {
    removeMousemove();
    TEvent.addListener(map, "mousemove", (p) => {
        var lnglat = map.fromContainerPixelToLngLat(p);
        jQuery("input#info").val(lnglat.getLng() + "," + lnglat.getLat());
    })
}
function removeMousemove() {
    TEvent.removeListener(mapmousemmove);
}


// 添加 WMS 图层
var wmsLayer;
function getWMS(layerName, url, config) {
    if (wmsLayer) {
        map.removeLayer(wmsLayer);
    }
    wmsLayer = new TTileLayerWMS(layerName, url, config);  // 创建WMS图层对象
    map.addLayer(wmsLayer);
}
function addSuperMapLayer(layers, url) {
    var config = {
        REQUEST: "GetMap", //操作名称
        VERSION: "1.1.1",
        SERVICE: "WMS",  // 服务类型标识符
        LAYERS: layers,
        TRANSPARNENT: true, //输出图像背景是否透明
        STYLES: "",  // 每个请求图层的用 "," 分隔的描述样式
        FORMAT: "image/png",
        SRS: map.getCode(),  // 地图的投影类型
        WIDTH: 256,  //图片像素宽
        HEIGHT: 256
    };
    getWMS(layers, url, config);
}

// 工具
var rectTool, rectOverlay, lineTool;
var marker, markerTool;
var polygonTool, circleTool;
function addTools() {
    // 矩形绘制工具
    var config = {
        strokeColor: "blue",
        strokeWeight: "5px",
        strokeStyle: "solid",
        fillColor: "#FFFFFF",
        opacity: 0.5
    };
    rectTool = new TRectTool(map, config);
    TEvent.addListener(rectTool, "draw", (bounds) => {
        // 注册矩形工具绘制完成后的事件
        rectOverlay = new TRect(bounds);
        map.addOverLay(rectOverlay);
        rectTool.close(); //？？ 有必要吗，不是有关闭的按钮了
    });
    //折线绘制工具
    var config = {
        strokeColor: "blue",
        strokeWeight: "3px",
        strokeOpacity: 0.5,
        strokeStyle: "solid"
    };
    lineTool = new TPolylineTool(map, config);
    TEvent.addListener(lineTool, "draw", () => {
        lineTool.close();
    });
    // 标注工具
    // 有个问题，参考代码也是这样，
    //？？只有在添加标注之后点击编辑才可以对标注进行编辑，并且不可以退出编辑状态？？？
    markerTool = new TMarkTool(map);
    TEvent.addListener(markerTool, "mouseup", (lnglat) => {
        console.log("test-end?");
        marker = TMarker(lnglat);
        map.addOverLay(marker);
        markerTool.close();
    });
    //多边形工具
    config = {
        strokeColor: "blue",
        strokeWeight: "3px",
        strokeOpacity: 0.5,
        strokeStyle: "dashed",
        fillColor: "#FFFFFF",
        fillOpacity: 0.5
    };
    polygonTool = new TPolygonTool(map, config);
    TEvent.addListener(polygonTool, "draw", (bounds, area) => {
        polygonTool.close();
        console.log("坐标:" + bounds);
        console.log(area);
    });
    //圆形工具
    circleTool = new TCircleTool(map, config);
    TEvent.addListener(circleTool, "draw", (center, radius) => {
        jQuery("div#circleTool>input#circleInfo").val("半径是：" + parseInt(radius) + "米");
        //jQuery("div#circleTool>input#circleInfo")[0].value="tet";

    });
    TEvent.addListener(circleTool, "drawend", (circle) => {
        // map.addOverLay(circle); //不可以添加。。。
        map.addOverLay(new TCircle(circle.getCenter(), circle.getRadius())); // 默认的样式
        circleTool.close();
    });
}


module.exports = {
    onLoad: onLoad
}