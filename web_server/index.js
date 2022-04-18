"use strict";

module.exports.startWebServer = async (param_arg_path_to_expose = null) => {

  const portfinder = require('portfinder')
  let HTTP_PORT = process.env.WEB_PORT || 8081
  const arg_path_to_expose = process.argv[2] || param_arg_path_to_expose
  const morgan = require('morgan')
  const express = require('express')
  const app = express()
  const router = express.Router()
  const util = require('util')

  try {
    HTTP_PORT = await portfinder.getPortPromise({port: 8080, stopPort:8090})
  } catch(err) {
    console.error(`[NO AVAILABLE PORT] from=[8080] end-[8090]`)
    return
  }

  let path_in_url = '/' // path of the URL
  let path_to_expose = `${arg_path_to_expose}` || `${__dirname}/html_content` // directory to expose
  //let path_to_expose = `${process.cwd()}/html_content` // directory to expose
  if(process.env.STATIC_PATH_IN_URL != undefined && process.env.STATIC_PATH_IN_URL != "") {
    path_in_url = process.env.STATIC_PATH_IN_URL
  }
  if(process.env.STATIC_PATH_TO_EXPOSE != undefined && process.env.STATIC_PATH_TO_EXPOSE != "") {
    path_to_expose = process.env.STATIC_PATH_TO_EXPOSE
  }
  let reg_exp = new RegExp("^\\.")
  path_to_expose = path_to_expose.replace(reg_exp, __dirname)
  console.log(' >>> dirname=[%s] cwd=[%s]', __dirname, process.cwd())

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'))
  app.disable('x-powered-by')

  const server = app.listen( HTTP_PORT, () => {
    console.log(' >> App is running in HTTP_PORT=[%s] ', HTTP_PORT)
  })

  let serverRootPath = `${process.cwd()}`
  let index_file = 'index.html' // { false, <index file name>}

  app.use(path_in_url, express.static(path_to_expose, { index: index_file }))
  console.log(' >> [PATH] url=[http://localhost:%s%s] exposed_dir=[%s] path_in_url=[%s]', HTTP_PORT, path_in_url, path_to_expose, path_in_url)

  // healthcheck
  app.get('/healthcheck', (req, res) => {
    res.status(200).send()
  })

  // 404 Not Found
  app.get('*', function(req, res){
    res.status(404).send('404 Not Found')
  })
  app.post('*', function(req, res){
    res.status(404).send('404 Not Found')
  })
  app.put('*', function(req, res){
    res.status(404).send('404 Not Found')
  })
  router.get('*', function(req, res){
    res.status(404).send('404 Not Found')
  })
  router.post('*', function(req, res){
    res.status(404).send('404 Not Found')
  })
  router.put('*', function(req, res){
    res.status(404).send('404 Not Found')
  })

}
