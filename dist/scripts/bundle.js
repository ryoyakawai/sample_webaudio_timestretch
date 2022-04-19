/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/loadaudio.js":
/*!**********************************!*\
  !*** ./src/scripts/loadaudio.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"fetchAudio\": () => (/* binding */ fetchAudio)\n/* harmony export */ });\n\n\nconst fetchAudio = async (file_location = null) => {\n  if (file_location == null) {\n    throw new Error(`[ERROR] fetchAudio: File Path is not Defined. file_location=[${file_location}]`)\n  }\n\n  try {\n    const response = await fetch(file_location)\n    return await response.arrayBuffer()\n  } catch (err) {\n    throw new Error(`[ERROR] fetchAudio: Something Occured during fetchg file. file_location=[${file_location}]`)\n  }\n}\n\n\n\n\n//# sourceURL=webpack://sample_webaudio_timestretch/./src/scripts/loadaudio.js?");

/***/ }),

/***/ "./src/scripts/main.js":
/*!*****************************!*\
  !*** ./src/scripts/main.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _loadaudio_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadaudio.js */ \"./src/scripts/loadaudio.js\");\n/* harmony import */ var _mainlib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mainlib.js */ \"./src/scripts/mainlib.js\");\n\n\n\n\n\nconst _MP3_URL = './mp3/eine.mp3';\nconst SEEK_DURATION_MSEC = 30\nconst wa = {\n  a_ctx: null,\n  source: null,\n  arrayBuffer: null,\n  a_ctx_start_time: 0,\n  a_ctx_paused_time: 0\n};\nlet isPlaying = false;\nlet seekTimerId = 0;\n\nconst AudioContext = window.AudioContext || window.webkitAudioContext;\n\n(async () => {\n  const allow_play = async () => {\n    wa.a_ctx = new AudioContext()\n    console.log('Playback resumed successfully!')\n    try {\n      wa.arrayBuffer = await (0,_loadaudio_js__WEBPACK_IMPORTED_MODULE_0__.fetchAudio)(_MP3_URL)\n    } catch (err) {\n      console.error(`[ERROR] allow_play: msg=[${JSON.stringify(err)}]`)\n    }\n  }\n\n  const toggle_display_time = (callback = () => {}) => {\n    if (isPlaying) {\n      seekTimerId = setInterval( () => {\n        if (wa.source.buffer !== null) {\n          const duration = wa.source.buffer.duration.toFixed(2)\n          const current_position = (wa.a_ctx_paused_time + wa.a_ctx.currentTime - wa.a_ctx_start_time).toFixed(4)\n          callback(current_position, duration)\n        }\n      }, SEEK_DURATION_MSEC)\n    } else {\n      clearInterval(seekTimerId)\n    }\n  }\n\n  const main = () => {\n    // Get UI elements\n    const seek_bar = document.querySelector('#seek_bar')\n    //const seek_bar_val = document.querySelector('span#seek_bar_val')\n    const seek_bar_text = document.querySelector('span#seek_bar_text')\n    const loadaudio_button = document.querySelector('#loadaudio_button')\n    const toggle_button = document.querySelector('#toggle_button')\n\n    // Init UI\n    toggle_button.setAttribute('disabled', 'disabled')\n\n    const setPausedTime = () => {\n      wa.a_ctx_start_time = wa.a_ctx.currentTime - wa.a_ctx_start_time\n    }\n\n    const seek_bar_callback = (current_position = 0, duration = 0) => {\n      seek_bar.value = (100 * current_position/duration)\n      let [hour, min, sec, msec] = (0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.convTimeFormatFromSec)(current_position)\n      seek_bar_text.innerHTML=`${hour}:${min}:${sec}:${msec}`\n    }\n\n    //\n    /*\n    seek_bar.addEventListener('input', (event) => {\n      seek_bar_val.innerHTML = event.target.value\n    })\n    */\n\n    //\n    loadaudio_button.addEventListener('mousedown', async () => {\n      loadaudio_button.setAttribute('disabled', 'disabled')\n      try {\n        await allow_play()\n      } catch (err) {\n        console.error(`[ERROR] allow_play: msg=[${JSON.stringify(err)}]`)\n      }\n      toggle_button.removeAttribute('disabled')\n    })\n\n    //\n    toggle_button.addEventListener('mousedown', async () => {\n      if (!isPlaying) {\n        toggle_button.innerHTML = '■ Stop'\n        wa.source = wa.a_ctx.createBufferSource()\n        await new Promise((resolve) => {\n          wa.a_ctx.decodeAudioData(wa.arrayBuffer.slice(), (buf) => {\n            wa.source.buffer = buf\n            wa.source.loop = false;\n            resolve()\n          })\n        })\n        wa.source.connect(wa.a_ctx.destination)\n        wa.source.start(0, wa.a_ctx_paused_time + wa.a_ctx_start_time)\n        setPausedTime()\n      } else {\n        toggle_button.innerHTML = '▶ Start'\n        setPausedTime()\n        wa.source.stop(0)\n        wa.source.buffer = null\n      }\n      isPlaying = !isPlaying\n      toggle_display_time(seek_bar_callback)\n    })\n  }\n\n  main()\n\n})()\n\n\n\n\n//# sourceURL=webpack://sample_webaudio_timestretch/./src/scripts/main.js?");

/***/ }),

/***/ "./src/scripts/mainlib.js":
/*!********************************!*\
  !*** ./src/scripts/mainlib.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"convTimeFormatFromSec\": () => (/* binding */ convTimeFormatFromSec),\n/* harmony export */   \"getGetParams\": () => (/* binding */ getGetParams)\n/* harmony export */ });\n\n\nconst getGetParams = (getConf={}) => {\n  const keys = Object.keys(getConf)\n  if (keys.length<1) return {}\n  const url = new URL(window.location.href)\n  const raw_params = url.searchParams\n  let result = {}\n  for (let i=0; i<keys.length; i+=1) {\n    switch (getConf[keys[i]]) {\n      case 'Number':\n        result[keys[i]] = Number(raw_params.get(keys[i]))\n        break\n      case 'String':\n        result[keys[i]] = raw_params.get(keys[i])==null ? '' : String(raw_params.get(keys[i])).split(' ')\n        break\n    }\n  }\n  return result\n}\n\nconst convTimeFormatFromSec = (current_position = 0) => {\n  const hour = ('00' + parseInt(current_position / 3600)).substr(-2)\n  const min = ('00' + parseInt((current_position / 60) % 60)).substr(-2)\n  const sec = ('00' + parseInt(current_position % 60)).substr(-2)\n  const msec = (String(current_position).split('.').pop()).substr(0, 2)\n  return [hour, min, sec, msec]\n}\n\n\n\n\n\n//# sourceURL=webpack://sample_webaudio_timestretch/./src/scripts/mainlib.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/main.js");
/******/ 	
/******/ })()
;