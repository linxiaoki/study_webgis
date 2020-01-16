//MapTypeSelect.js
//import {Component} from "react";

import React, { Component } from "react";

// 地图类型选择器
export default class MapTypeSelect extends Component {

    // 还要传 map 参数，不会，在 app.js 里面写好了
    switchingMaptype111(event) {
        console.log(event.target.value);   
    }
    // 渲染
    render() {
        return (
            <select id="mapTypeSelect" class="form-control">
                <option value="TMAP_NORMAL_MAP">地图</option>
                <option value="TMAP_SATELLITE_MAP">卫星</option>
                <option value="TMAP_HYBRID_MAP">卫星混合</option>
                <option value="TMAP_TERRAIN_MAP">地形</option>
                <option value="TMAP_TERRAIN_HYBRID_MAP">地形混合</option>
            </select>
        );
    }
};

//export default MapTypeSelect;