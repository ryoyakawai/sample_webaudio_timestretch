'use strict';
const _BASE_DIR = __dirname
const _HTML_DIR = `${_BASE_DIR}/../dist/`

const server = require('./server.js');

server.startWebServer(_HTML_DIR)
