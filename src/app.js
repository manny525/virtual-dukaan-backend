const express=require('express')
require('./db/mongoose')

const app=express()

const userRouter = require('./routers/user')
const inventoryRouter = require('./routers/inventory')
const orderRouter = require('./routers/order')

app.use(express.json())
app.use(userRouter)
app.use(inventoryRouter)
app.use(orderRouter)
app.use(require('./routers/search'))
app.use(require('./routers/service'))


app.use(require('./routers/customer'))
app.use(require('./routers/card'))
app.use(require('./routers/loyalty'))
app.use(require('./routers/cart'))
app.use(require('./routers/payment'))


module.exports=app

