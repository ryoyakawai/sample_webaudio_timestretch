'use strict';
const _BASE_DIR = __dirname
const _HTML_DIR = `${_BASE_DIR}/html_content/`

const server = require('./server.js');

server.startWebServer(_HTML_DIR)
