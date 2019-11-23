//MapTypeSelect.js
//import {Component} from "react";
// 想用 render ，发现不太会 React, 
import React, { Component } from "react";

// 地图类型选择器
export default class MapTypeSelect extends Component {
    switchingMaptype(params) {
        console.log("不行");   
    }
    render() {
        return (
            <select id="mapTypeSelect2" onChange={switchingMapType(this)}>
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