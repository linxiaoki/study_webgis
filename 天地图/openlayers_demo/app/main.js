//main.js
//import {onLoad} from ("./app.js") ? 这样可以吗  export { }   才用import？
import {render} from 'react-dom';
import React from 'react';
import MapTypeSelect from './render/MapTypeSelect';
import './style.css';
const {onLoad} = require("./app.js");

// 自定义样式地图类型控件，事件在 app.js 里面绑定
render(
    <MapTypeSelect />,
    document.getElementById('mapTypeStyle')
)


onLoad()
//import './app.js'



