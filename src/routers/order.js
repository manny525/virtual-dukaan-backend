const express = require('express')
const Order = require('../models/order')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth_customer')
const auth_merchant = require('../middleware/auth')

router.post('/orders/new', auth, async (req, res) => {
    console.log(req.body)
    const order = new Order({
        ...req.body
    })
    try {
        console.log(order)
        await order.save()
        console.log('saved')
        res.status(201).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/orders/merchant', auth_merchant, async (req, res) => {
    try {
        var orders= new Array();
        orders = await Order.find({ merchantId: req.user._id })
        if (!orders) {
            return res.status(404).send()
        }
        res.send(orders)
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/orders/customer', auth, async (req, res) => {
    try {
        var orders= new Array();
        orders = await Order.find({ customerId: req.user._id })
        if (!orders) {
            return res.status(404).send()
        }
        res.send(orders)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/orders/status', auth_merchant, async (req, res) => {
    try {
        const order = await Order.findOne({_id: req.body._id})
        if (!order) {
            res.status(404).send({message: 'Not found'})
        }
        order.status = req.body.status
        await order.save()
        res.send(order)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router