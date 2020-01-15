//MapTypeSelect.js
//import {Component} from "react";
import React, { Component } from "react";
import style from "./main.css";

// 地图类型选择器
export default class indexHtml extends Component {
  // 渲染
  render() {
    return (
      <div>
        <div className={style.mapTool}>
          <button id="showMarkerClusterer">聚合点展示</button>
          <input type="text" id="info" defaultValue="test" />
          <div id="wmstool" >
            <input type="button" defaultValue="叠加超图WMS服务图层" />
            <input type="button" defaultValue="删除超图WMS服务图层" />
          </div>
          <div id="rectTool" style={{ top: "120px" }}>
            <span>矩形工具</span>
            <input type="button" defaultValue="开启" />
            <input type="button" defaultValue="关闭" />
            <input type="button" defaultValue="清除" />
          </div>
          <div id="lineTool" style={{ top: "120px", left: "260px" }}>
            <span>折线工具</span>
            <input type="button" defaultValue="开启" />
            <input type="button" defaultValue="关闭" />
            <input type="button" defaultValue="清除" />
          </div>
          <div id="markerTool" style={{ top: "120px", left: "540px" }}>
            <span>标注工具</span>
            <input type="button" defaultValue="开启" />
            <input type="button" defaultValue="关闭 " />
            <input type="button" defaultValue="编辑" />
          </div>
          <div id="polygonTool" style={{ top: "160px", order: "0px" }}>
            <span>多边形工具</span>
            <input type="button" defaultValue="开启" /><input type="button" defaultValue="关闭" />
          </div>
          <div id="circleTool" style={{ top: "160px", left: "260px" }}>
            <span>画圆工具</span>
            <input type="button" defaultValue="开启" /><input type="button" defaultValue="关闭" />
            <input type="text" name="" id="circleInfo" />
          </div>
        </div>
        <div id="lineEditControl" style={{ position: "absolute", right: "50px" }}>
          <input id="enable" type="button" defaultValue="启动编辑" />
          <input id="disable" type="button" defaultValue="禁止编辑" />
        </div>
        <div id="mapDiv" style={{ position: "absolute", height: "75%", width: "100%", top: "220px" }}></div>
        <div id="mapTypeStyle"></div>
        <div id={style.mapZoom} style={{ position: "relative" }}>
          <div id="zoomIn">放大</div>
          <div id="zoomOut">缩小</div>
        </div>

      </div>
    );
  }
};

export class testadd extends Component {
  render() {
    return (
      <div>
        {/* 搜索面板 */}
        < div class={style.search} >
          <input type="text" id="keywords" value="KFC" style="border:0px solid #999999;font-size:large" />
          <input type="button" id="searchBtn" value="搜索" />
        </div >
        <br />
        {/* 提示词面板 */}
        <div id="promptDiv" class="prompt"></div>
        {/* 统计面板 */}
        <div id="statisticsDiv" class={style.statistics}></div>
        {/* 搜索结果面板 */}
        <div id="resultDiv" class="result">
          <div id="searchDiv"></div>
          <div id="pageDiv">
            <input type="button" value="第一页" onClick="localsearch.firtPage()" />
            <input type="button" value="上一页" onClick="localsearch.previousPage()" />
            <input type="button" value="下一页" onClick="localsearch.nextPage()" />
            <input type="button" value="最后一页" onClick="localsearch.lastPage()" />
            <br />
            转到第<input type="text" name="" id="pageId" value="1" size="3" />页
<input type="button" onClick="localsearch.goto" value="转到" />
          </div>
        </div>
      </div >
    );
  }
}

