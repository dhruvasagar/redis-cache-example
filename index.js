const express = require('express')
const bodyParser = require('body-parser')
const redis = require('redis')
const PORT = process.env.PORT || '3000'

const app = express()
const client = redis.createClient()

app.use(bodyParser.json())

app.post('/messages', (req, res, next) => {
  var id = req.body.id
  client.setex(id, 30, req.body.message)
  res.status(200).type('json').send('Document stored')
})

app.get('/messages/:id', (req, res, next) => {
  client.get(req.params.id, (err, data) => {
    if (err) {
      res.status(404).send('Resource not found')
      return
    }

    res.status(200).type('json').send(data)
  })
})

app.listen(PORT, () => console.log('Server listening on port: ', PORT))
