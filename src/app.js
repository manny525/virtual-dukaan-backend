const express=require('express')
require('./db/mongoose')

const app=express()

const userRouter = require('./routers/user')
const inventoryRouter = require('./routers/inventory')
const orderRouter = require('./routers/order')

const router = new express.Router();

router.get('/', async (req, res) =>{
    res.send({ status: 'Working', time: new Date().toLocaleTimeString(), project: 'CC Project by 174124', name: 'Virtual Dukaan Server',
        message: 'Use mobile app to view project', author: 'Manthan Mitesh Tolia'
    })
})

app.use(express.json())
app.use(router)
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

