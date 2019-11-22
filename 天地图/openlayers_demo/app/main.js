//main.js
//import {onLoad} from ("./app.js") ? 这样可以吗  export { }   才用import？
import {render} from 'react-dom';
//import React from 'react';
import MapTypeSelect from './MapTypeSelect';

const {onLoad} = require("./app.js");
onLoad();
render(
    document.getElementById('mapDiv'),
    <MapTypeSelect/>
)