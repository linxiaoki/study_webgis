//MapTypeSelect.js
import {component} from "react"; 

// 地图类型选择器
export default class MapTypeSelect extends component {
    render() {
        return (
            <div id="mapTypeStyle">
                <select id="mapTypeSelect" onChange="switchingMapType(this)">
                    <option value="TMAP_NORMAL_MAP">地图</option>
                    <option value="TMAP_SATELLITE_MAP">卫星</option>
                    <option value="TMAP_HYBRID_MAP">卫星混合</option>
                    <option value="TMAP_TERRAIN_MAP">地形</option>
                    <option value="TMAP_TERRAIN_HYBRID_MAP">地形混合</option>
                </select>
            </div>
            //script?
        );
    }
};

// export default MapTypeSelect;