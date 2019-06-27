const express = require('express')
const routes = require('./routes')

function createApp() {
  const app = express()

  app.use('/', routes)
  app.listen(3000)

  return app
}

module.exports.createApp = createApp
