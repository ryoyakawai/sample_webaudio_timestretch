'use strict';
const _BASE_DIR = __dirname
const _HTML_DIR = `${_BASE_DIR}/web_server/html_content/`

const server = require('./web_server/index.js');


console.log()
server.startWebServer(_HTML_DIR)
