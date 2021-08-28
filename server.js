const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const app = express()
const bodyparser = require('body-parser')
const sgMail = require('@sendgrid/mail')
const cors = require('cors')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.use(bodyparser.json())
app.use(cors({
  origin: '*'
}))

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

app.post('/checkout', (req, res, next) => {
  const purchaseData = req.body

  const shippingCost = purchaseData.customerDetails['street-one'] ? 5 : 0

  let emailText = `Hey ${purchaseData.customerDetails['customer-name']}!\n\nYou ordered the following items: ${purchaseData.cart.map(product => product.name).join(', ')}.\nYour total is \$${purchaseData.cart.reduce((acc, curr) => acc + curr.price, 0) + shippingCost}.\nPlease venmo me at @harryshapiro.`

  if (shippingCost) {
    emailText += `\n\nShipping to:\n${purchaseData.customerDetails['street-one']}`
    if (purchaseData.customerDetails['street-two']) emailText += `\n${purchaseData.customerDetails['street-two']}`
    emailText += `\n${purchaseData.customerDetails.city}\n${purchaseData.customerDetails.state}\n${purchaseData.customerDetails.zip}`
  }

  emailText += '\n\nXOXO, E-MOM'

  const msg = {
    to: purchaseData.customerDetails['customer-email'],
    cc: 'orders@e-mom.energy',
    from: 'you-have@e-mom.energy',
    subject: 'Your E-MOM Order',
    text: emailText
  }

  sgMail
    .send(msg)
    .then(() => {
      res.sendStatus(201)
    })
    .catch((error) => {
      console.error('Error sending email', error)
      res.sendStatus(500)
    })
})

// Every route that doesn't match a static resource should direct to the index html
app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
})

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server running on port:', port)
})
