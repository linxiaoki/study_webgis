<template>
    <div id="mapTypeStyle">
        <select id="mapTypeSelect" bind-map="map" v-model="map_type" @click="test" @change="test2">
            <option value="TMAP_NORMAL_MAP">地图</option>
            <option value="TMAP_SATELLITE_MAP">卫星</option>
            <option value="TMAP_HYBRID_MAP">卫星混合</option>
            <option value="TMAP_TERRAIN_MAP">地形</option>
            <option value="TMAP_TERRAIN_HYBRID_MAP">地形混合</option>
        </select>
    </div>
</template>
<script>
    export default {
        props:[
            "bindMap"
        ],
        data: function () {
            return {
                map_type: 'TMAP_SATELLITE_MAP',
            }
        },
        methods: {
            test2() {
                this=this;
                var bindMap = this.bindMap;
                console.log(this.map_type);
                switch (_this.map_type) {
                    case "TMAP_NORMAL_MAP": ()=>{
                        bindMap.setMapType(TMAP_NORMAL_MAP);
                    };
                        break;
                    case "TMAP_SATELLITE_MAP": ()=>{
                        bindMap.setMapType(TMAP_SATELLITE_MAP);
                    };
                        break;
                    case "TMAP_HYBRID_MAP": ()=>{
                        bindMap.setMapType(TMAP_HYBRID_MAP);
                    };
                        break;
                    case "TMAP_TERRAIN_MAP": ()=>{
                        bindMap.setMapType(TMAP_TERRAIN_MAP);
                    };
                        break;
                    case "TMAP_TERRAIN_HYBRID_MAP": ()=>{
                        bindMap.setMapType(TMAP_TERRAIN_HYBRID_MAP);
                    };
                        break;
                }
            },
            test(){
                console.log("test" + this.map_type);
            }
        }
    }
</script>