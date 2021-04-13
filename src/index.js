const app = require('./app')

const port = require('../config').PORT

app.listen(port, () => {
    console.log('Server is up on ' + port)
})

