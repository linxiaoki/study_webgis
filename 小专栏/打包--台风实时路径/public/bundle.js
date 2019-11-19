/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/app.js":
/*!********************!*\
  !*** ./app/app.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//app.js
var typhoonImg = __webpack_require__(/*! ./typhoon.png */ "./app/typhoon.png");

var mapAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">世界地图</a> contributors, ' + '<a href="http://giscafer.com/">giscafer</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var mapboxUrl = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiemhhbmdzMTIzIiwiYSI6ImNrMXR6NjZobzAweW0zY3BrcnB4YmF6M3YifQ.nHmNai_UTcEJdy1VTbCXfg";
var satellite = L.tileLayer(mapboxUrl, {
  id: 'mapbox.satellite',
  attribution: mapAttr
});
var streets = L.tileLayer(mapboxUrl, {
  id: 'mapbox.streets',
  attribution: mapAttr
});
var grayscale = L.tileLayer(mapboxUrl, {
  id: 'mapbox.light'
});
var map = L.map("mapDiv", {
  center: [45.51, -122.2],
  zoom: 6,
  layers: [satellite, streets, grayscale]
});
var basemap = {
  "影像图": satellite,
  "<span style='color: gray'>街道图</span>": streets //'grayscale': grayscale,

};
L.control.layers(basemap).addTo(map);
jQuery.ajax('http://typhoon.zjwater.gov.cn/Api/TyphoonInfo/201926', {
  type: 'GET',
  dataType: 'jsonp',
  success: addPolylineAndMarker
});
/*
var documentHead = $("head")[0];
var js=document.createElement('script');
js.src="http://typhoon.zjwater.gov.cn/Api/TyphoonInfo/201926?callback=addPolylineAndMarker";
documentHead.append(js);
*/
//回调函数： 动态画线

function addPolylineAndMarker(typhoonData) {
  // 动态画线
  function animateDrawLine(points, icon, popupContent) {
    var drawPoints = [points[0]];
    var marker = L.marker(drawPoints[drawPoints.length - 1], {
      icon: icon
    }).addTo(map);
    var lineLayers;
    var count = 0;
    var time = setInterval(function () {
      if (count < points.length - 1) {
        count += 1;
        drawPoints.push(points[count]); // lineLaers && map.removeLayer(lineLayers);

        lineLayers && map.removeLayer(lineLayers);
        lineLayers = null;
        map.removeLayer(marker);
        lineLayers = L.polyline(drawPoints, {
          color: 'blue'
        }).addTo(map);
        marker = L.marker(drawPoints[drawPoints.length - 1], {
          icon: icon
        }).addTo(map);

        if (count == points.length - 1) {
          marker.bindPopup(popupContent).openPopup();
        } //console.log("add")

      } else {
        clearInterval(time);
      }
    }, 200);
  } //typhoonCenter=[Number(typhoonData[0]["centerlat"]), Number(typhoonData[0]["centerlng"])];
  //map.panTo(typhoonCenter); 


  var forecast = typhoonData[0]["points"];
  var polylinePoints = [];
  forecast.forEach(function (point) {
    polylinePoints.push([Number(point['lat']), Number(point['lng'])]);
  });
  map.panTo(polylinePoints[0]); // 图标

  var typhoonIcon = L.icon({
    iconUrl: typhoonImg,
    //'./tornado.png',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
  popupContent = '<b>' + typhoonData[0]['name'] + '</b></br>' + forecast[forecast.length - 1]['jl']; // 动态画线

  animateDrawLine(polylinePoints, typhoonIcon, popupContent);
}

;

/***/ }),

/***/ "./app/main.js":
/*!*********************!*\
  !*** ./app/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.js */ "./app/app.js");
/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ "./app/typhoon.png":
/*!*************************!*\
  !*** ./app/typhoon.png ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected character '�' (1:0)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n(Source code omitted for this binary file)");

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map