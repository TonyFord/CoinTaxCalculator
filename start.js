const express = require('express')
const app     = express()
const port    = 3000
const opn     = require('opn');

app.use(express.static('data'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

opn('http://localhost:3000/index.html?coin=btc');
