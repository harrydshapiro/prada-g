const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const app = express()

// Force https middleware
function forceHttps (req, res, next) {
  if (!req.secure && req.hostname !== 'localhost') {
    res.redirect(`https://${req.hostname}${req.originalUrl}`)
  } else {
    next()
  }
}

// Force https in staging/prod
if (['staging', 'production'].includes(process.env.NODE_ENV)) {
  app.enable('trust proxy') // Since heroku is in front
  app.use(forceHttps)
}

// Serve static assets
app.use(serveStatic(path.join(__dirname, 'dist')))

// Every route that doesn't match a static resource should direct to the index html
app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
})

// Start server
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log('Server running on port:', port)
})
