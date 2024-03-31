const express = require('express')
const router = require('./routers/web')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const port = process.env.port
const connect = require('./config/database')

const configViewEngine = require('./config/viewEngine');



configViewEngine(app);
app.use('/', router)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
