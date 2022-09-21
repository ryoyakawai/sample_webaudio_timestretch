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

/***/ "./src/scripts/kali_wrapper.js":
/*!*************************************!*\
  !*** ./src/scripts/kali_wrapper.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"doStretch\": () => (/* binding */ doStretch),\n/* harmony export */   \"doStretchPromise\": () => (/* binding */ doStretchPromise)\n/* harmony export */ });\n\n\nconst doStretchPromise = (context, inputData, stretchFactor, numChannels, quickseek = false) => {\n  return new Promise((resolve) => {\n    var numInputFrames = inputData.length / numChannels;\n    var bufsize = 4096 * numChannels;\n\n    // Create a Kali instance and initialize it\n    var kali = new Kali(numChannels);\n    kali.setup(context.sampleRate, stretchFactor, quickseek);\n\n    // Create an array for the stretched output\n    var completed = new Float32Array(Math.floor((numInputFrames / stretchFactor) * numChannels + 1));\n\n    var inputOffset = 0;\n    var completedOffset = 0;\n    var loopCount = 0;\n    var flushed = false;\n\n    while (completedOffset < completed.length) {\n      if (loopCount % 100 == 0) {\n        console.log(\"Stretching\", completedOffset  / completed.length);\n      }\n\n      // Read stretched samples into our output array\n      completedOffset += kali.output(completed.subarray(completedOffset, Math.min(completedOffset + bufsize, completed.length)));\n      if (inputOffset < inputData.length) { // If we have more data to write, write it\n        var dataToInput = inputData.subarray(inputOffset, Math.min(inputOffset + bufsize, inputData.length));\n        inputOffset += dataToInput.length;\n\n        // Feed Kali samples\n        kali.input(dataToInput);\n        kali.process();\n      } else if (!flushed) { // Flush if we haven't already\n        kali.flush();\n        flushed = true;\n      }\n\n      loopCount++;\n    }\n\n    resolve(completed);\n  })\n}\n\nconst doStretch = (context, inputData, stretchFactor, numChannels, quickseek = false) => {\n  var numInputFrames = inputData.length / numChannels;\n  var bufsize = 4096 * numChannels;\n\n  // Create a Kali instance and initialize it\n  var kali = new Kali(numChannels);\n  kali.setup(context.sampleRate, stretchFactor, quickseek);\n\n  // Create an array for the stretched output\n  var completed = new Float32Array(Math.floor((numInputFrames / stretchFactor) * numChannels + 1));\n\n  var inputOffset = 0;\n  var completedOffset = 0;\n  var loopCount = 0;\n  var flushed = false;\n\n  while (completedOffset < completed.length) {\n    if (loopCount % 100 == 0) {\n      console.log(\"Stretching\", completedOffset  / completed.length);\n    }\n\n    // Read stretched samples into our output array\n    completedOffset += kali.output(completed.subarray(completedOffset, Math.min(completedOffset + bufsize, completed.length)));\n    if (inputOffset < inputData.length) { // If we have more data to write, write it\n      var dataToInput = inputData.subarray(inputOffset, Math.min(inputOffset + bufsize, inputData.length));\n      inputOffset += dataToInput.length;\n\n      // Feed Kali samples\n      kali.input(dataToInput);\n      kali.process();\n    } else if (!flushed) { // Flush if we haven't already\n      kali.flush();\n      flushed = true;\n    }\n\n    loopCount++;\n  }\n\n  return completed;\n}\n\n\n\n\n\n//# sourceURL=webpack://sample_webaudio_timestretch/./src/scripts/kali_wrapper.js?");

/***/ }),

/***/ "./src/scripts/loadaudio.js":
/*!**********************************!*\
  !*** ./src/scripts/loadaudio.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"decodeAudioDataPromise\": () => (/* binding */ decodeAudioDataPromise),\n/* harmony export */   \"decodeAudioDataStretchPromise\": () => (/* binding */ decodeAudioDataStretchPromise),\n/* harmony export */   \"fetchAudio\": () => (/* binding */ fetchAudio)\n/* harmony export */ });\n/* harmony import */ var _kali_wrapper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./kali_wrapper.js */ \"./src/scripts/kali_wrapper.js\");\n\n\n\nconst fetchAudio = async (file_location = null) => {\n  if (file_location == null) {\n    throw new Error(`[ERROR] fetchAudio: File Path is not Defined. file_location=[${file_location}]`)\n  }\n\n  try {\n    const response = await fetch(file_location)\n    const res_arrayBuffer = await response.arrayBuffer()\n    return res_arrayBuffer\n  } catch (err) {\n    throw new Error(`[ERROR] fetchAudio: Something Occured during fetchg file. file_location=[${file_location}]`)\n  }\n}\n\nconst decodeAudioDataPromise = async (wa = {}) => {\n  const source = wa.a_ctx.createBufferSource()\n  const arrayBuffer = wa.arrayBuffer.slice()\n  return new Promise((resolve) => {\n    wa.a_ctx.decodeAudioData(arrayBuffer, (decodedBuffer) => {\n      source.buffer = decodedBuffer\n      source.loop = false\n      console.log('[info] completed to load audio')\n      resolve(source)\n    })\n  })\n}\n\nconst decodeAudioDataStretchPromise = (wa = {}, rate = 1, quickseek = true) => {\n  const source = wa.a_ctx.createBufferSource()\n  const arrayBuffer = wa.arrayBuffer.slice()\n  const numChannels = 1\n  return new Promise((resolve) => {\n    wa.a_ctx.decodeAudioData(arrayBuffer, async (decodedBuffer) => {\n\n      // do stretch\n      console.log('[info] begin stretch and load audio')\n      const inputData_0 = await decodedBuffer.getChannelData(0);\n      const inputData_1 = await decodedBuffer.getChannelData(1);\n\n      const promises = [\n        (0,_kali_wrapper_js__WEBPACK_IMPORTED_MODULE_0__.doStretchPromise)(wa.a_ctx, inputData_0, parseFloat(rate), numChannels, quickseek),\n        (0,_kali_wrapper_js__WEBPACK_IMPORTED_MODULE_0__.doStretchPromise)(wa.a_ctx, inputData_1, parseFloat(rate), numChannels, quickseek)\n      ]\n      const output = await Promise.allSettled(promises)\n      const [output_0, output_1] = [output[0].value, output[1].value]\n\n      const outputAudioBuffer = wa.a_ctx.createBuffer(2, output_0.length, wa.a_ctx.sampleRate)\n      outputAudioBuffer.getChannelData(0).set(output_0)\n      outputAudioBuffer.getChannelData(1).set(output_1)\n\n      source.buffer = outputAudioBuffer\n      source.loop = false\n\n      console.log('[info] completed to strech and load audio')\n      resolve(source)\n    })\n  })\n}\n\n\n\n\n\n//# sourceURL=webpack://sample_webaudio_timestretch/./src/scripts/loadaudio.js?");

/***/ }),

/***/ "./src/scripts/main.js":
/*!*****************************!*\
  !*** ./src/scripts/main.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _loadaudio_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadaudio.js */ \"./src/scripts/loadaudio.js\");\n/* harmony import */ var _mainlib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mainlib.js */ \"./src/scripts/mainlib.js\");\n\n\n\n\n\nconst _MP3_URL = './mp3/eine.mp3';\nconst SEEK_DURATION_MSEC = 30\nconst wa = {\n  a_ctx: null,\n  source: null,\n  file_name: '',\n  arrayBuffer: null,\n  a_ctx_start_time: 0,\n  a_ctx_paused_time: 0\n};\nlet isPlaying = false;\nlet seekTimerId = 0;\n\nconst AudioContext = window.AudioContext || window.webkitAudioContext;\n\n(async () => {\n  // Get UI elements\n  const seek_bar = document.querySelector('input#seek_bar')\n  const seek_bar_text = document.querySelector('span#seek_bar_text')\n  const loadaudio_button = document.querySelector('button#loadaudio_button')\n  const start_stop_button = document.querySelector('button#start_stop_button')\n  const playback_rate = document.querySelector('input#playback_rate')\n  const playback_rate_text = document.querySelector('span#playback_rate_text')\n\n  const allow_play = async () => {\n    wa.a_ctx = new AudioContext()\n    try {\n      wa.arrayBuffer = await (0,_loadaudio_js__WEBPACK_IMPORTED_MODULE_0__.fetchAudio)(_MP3_URL)\n      wa.file_name = _MP3_URL.split('/').pop()\n      start_stop_button.innerHTML = `▶ Start : ${wa.file_name}`\n      console.log(`[message] ${_MP3_URL} is loaded.`)\n      wa.source = await (0,_loadaudio_js__WEBPACK_IMPORTED_MODULE_0__.decodeAudioDataPromise)(wa)\n      ;(0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.toggle_button_disable)(seek_bar)\n      loadaudio_button.innerHTML = '🔄 Reload Page To Change Music'\n    } catch (err) {\n      console.error(`[ERROR] allow_play: msg=[${JSON.stringify(err)}]`)\n    }\n  }\n\n  const start_update_display_time = (callback = () => { }) => {\n    seekTimerId = setInterval(() => {\n      if (wa.source.buffer !== null) {\n        const duration = wa.source.buffer.duration.toFixed(2)\n        const current_position = (wa.a_ctx_paused_time + wa.a_ctx.currentTime - wa.a_ctx_start_time).toFixed(4)\n        callback(current_position, duration)\n      }\n    }, SEEK_DURATION_MSEC)\n  }\n  const stop_update_display_time = () => (\n    clearInterval(seekTimerId)\n  )\n\n  const setPausedTime = () => {\n    wa.a_ctx_start_time = wa.a_ctx.currentTime - wa.a_ctx_start_time\n  }\n\n  const seek_bar_callback = (current_position = 0, duration = 0) => {\n    seek_bar.value = (100 * current_position / duration)\n    const [hour, min, sec, msec] = (0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.convTimeFormatFromSec)(current_position)\n    seek_bar_text.innerHTML = `${hour}:${min}:${sec}:${msec}`\n  }\n\n  const uploadFilDragOver = (event) => {\n    event.stopPropagation()\n    event.preventDefault()\n\n    event.dataTransfer.dropEffect = 'copy';\n    event.target.setAttribute('disabled', 'disabled')\n  }\n  const uploadFilDragLeave = (event) => {\n    event.stopPropagation()\n    event.preventDefault()\n\n    event.target.removeAttribute('disabled')\n  }\n  const uploadFileDrop = (event) => {\n    event.stopPropagation()\n    event.preventDefault()\n\n    const file = event.dataTransfer.files[0]\n    wa.file_name = file.name\n    const reader = new FileReader()\n    reader.onload = async (ev) => {\n      wa.arrayBuffer = ev.target.result\n      wa.a_ctx = new AudioContext()\n      console.log(`[message] ${file.name} is loaded.`)\n      wa.source = await (0,_loadaudio_js__WEBPACK_IMPORTED_MODULE_0__.decodeAudioDataPromise)(wa)\n      start_stop_button.innerHTML = `▶ Start : ${wa.file_name}`\n      ;(0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.toggle_button_disable)([start_stop_button, seek_bar, playback_rate])\n      loadaudio_button.innerHTML = 'Reload Page To Change Music'\n    }\n    reader.readAsArrayBuffer(file)\n  }\n\n  const main = () => {\n    // Init UI\n    ;(0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.toggle_button_disable)([start_stop_button, seek_bar, playback_rate])\n\n    //\n    seek_bar.addEventListener('input', async (event) => {\n      if (typeof wa.source.buffer.duration !== undefined) {\n        const duration = wa.source.buffer.duration\n        const seek_position = duration * event.target.value / 100\n        wa.a_ctx_paused_time = seek_position\n        const [hour, min, sec, msec] = (0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.convTimeFormatFromSec)(seek_position)\n        seek_bar_text.innerHTML = `${hour}:${min}:${sec}:${msec}`\n      }\n    })\n\n    //\n    playback_rate.addEventListener('input', async (event) => {\n      playback_rate_text.innerHTML = (Number(event.target.value)).toFixed(2)\n    })\n    playback_rate.addEventListener('change', async (event) => {\n      start_stop_button.innerHTML = `Processing ${wa.file_name}...`\n      ;(0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.toggle_button_disable)([start_stop_button, seek_bar, playback_rate])\n      wa.source = await (0,_loadaudio_js__WEBPACK_IMPORTED_MODULE_0__.decodeAudioDataStretchPromise)(wa, event.target.value, false)\n      start_stop_button.innerHTML = `▶ Start : ${wa.file_name}`\n      ;(0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.toggle_button_disable)([start_stop_button, seek_bar, playback_rate])\n    })\n\n    //\n    loadaudio_button.addEventListener('dragover', uploadFilDragOver, false);\n    loadaudio_button.addEventListener('dragleave', uploadFilDragLeave, false);\n    loadaudio_button.addEventListener('drop', uploadFileDrop, false);\n    loadaudio_button.addEventListener('mousedown', async () => {\n      (0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.toggle_button_disable)(loadaudio_button)\n      try {\n        await allow_play()\n        ;(0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.toggle_button_disable)([start_stop_button, playback_rate])\n      } catch (err) {\n        console.error(`[ERROR] loadaudio_button: msg=[${JSON.stringify(err)}]`)\n      }\n    })\n\n    //\n    start_stop_button.addEventListener('mousedown', async () => {\n      if (!isPlaying) {\n        (0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.toggle_button_disable)([seek_bar, playback_rate])\n        start_stop_button.innerHTML = `■ Stop : ${wa.file_name}`\n        wa.source.connect(wa.a_ctx.destination)\n        wa.source.start(0, wa.a_ctx_paused_time + wa.a_ctx_start_time)\n        setPausedTime()\n        start_update_display_time(seek_bar_callback)\n      } else {\n        (0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.toggle_button_disable)(start_stop_button)\n        start_stop_button.innerHTML = `Processing : ${wa.file_name}...`\n        setPausedTime()\n        stop_update_display_time(seek_bar_callback)\n        wa.source.stop(0)\n        wa.source.buffer = null\n        wa.source = await (0,_loadaudio_js__WEBPACK_IMPORTED_MODULE_0__.decodeAudioDataPromise)(wa)\n        start_stop_button.innerHTML = `▶ Start : ${wa.file_name}`\n        ;(0,_mainlib_js__WEBPACK_IMPORTED_MODULE_1__.toggle_button_disable)([start_stop_button, seek_bar, playback_rate])\n      }\n      isPlaying = !isPlaying\n    })\n  }\n\n  main()\n\n})()\n\n\n\n\n//# sourceURL=webpack://sample_webaudio_timestretch/./src/scripts/main.js?");

/***/ }),

/***/ "./src/scripts/mainlib.js":
/*!********************************!*\
  !*** ./src/scripts/mainlib.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"convTimeFormatFromSec\": () => (/* binding */ convTimeFormatFromSec),\n/* harmony export */   \"getGetParams\": () => (/* binding */ getGetParams),\n/* harmony export */   \"sleep\": () => (/* binding */ sleep),\n/* harmony export */   \"toggle_button_disable\": () => (/* binding */ toggle_button_disable)\n/* harmony export */ });\n\n\nconst sleep = msec => new Promise(resolve => setTimeout(resolve, msec))\n\nconst toggle_button_disable = (elem = null) => {\n  if (Array.isArray(elem)) {\n    elem.forEach( item => {\n      item.disabled = !item.disabled\n    })\n  } else {\n    elem.disabled = !elem.disabled\n  }\n}\n\nconst getGetParams = (getConf = {}) => {\n  const keys = Object.keys(getConf)\n  if (keys.length < 1) return {}\n  const url = new URL(window.location.href)\n  const raw_params = url.searchParams\n  let result = {}\n  for (let i = 0; i < keys.length; i += 1) {\n    switch (getConf[keys[i]]) {\n      case 'Number':\n        result[keys[i]] = Number(raw_params.get(keys[i]))\n        break\n      case 'String':\n        result[keys[i]] = raw_params.get(keys[i]) == null ? '' : String(raw_params.get(keys[i])).split(' ')\n        break\n    }\n  }\n  return result\n}\n\nconst convTimeFormatFromSec = (current_position = 0) => {\n  const hour = ('00' + parseInt(current_position / 3600)).substr(-2)\n  const min = ('00' + parseInt((current_position / 60) % 60)).substr(-2)\n  const sec = ('00' + parseInt(current_position % 60)).substr(-2)\n  const msec = (String(current_position).split('.').pop()).substr(0, 2)\n  return [hour, min, sec, msec]\n}\n\n\n\n\n\n\n//# sourceURL=webpack://sample_webaudio_timestretch/./src/scripts/mainlib.js?");

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