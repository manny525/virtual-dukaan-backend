const express = require('express')
const router = new express.Router()
const Payment = require('./../models/payment')
const Merchant = require('./../models/user')
const Customer = require('./../models/customer')
var randomize = require('randomatic')
const auth = require('./../middleware/auth')
require('./../db/mongoose')
const { sendPaymentOTP } = require('../emails/account')
const User = require('./../models/user')
const Order = require('../models/order')
const Service = require('../models/service')

router.post('/pull', async (req, res) => {
    try {
        var otp = randomize('Aa0', 6);
        var data = await Payment.findOne({ otp, merchantId: req.body.merchantId })
        while (data) {
            otp = randomize('Aa0', 6)
            data = Payment.findOne({ otp, merchantId: req.body.merchantId })
        }
        const payment = new Payment({
            ...req.body,
            otp
        })
        const customer = await Customer.findById(req.body.customerId)
        const merchant = await User.findById(req.body.merchantId)
        // const vCode = await sendPaymentOTP(customer.email, otp, merchant.merchantName)
        console.log(otp)
        const order = await Order.findById(req.body.orderId)
        if (!order) {
            const service = await Service.findById(req.body.orderId)
            console.log(service || 'service not found')
            service.status = 'completed'
            await service.save()
            await payment.save()
            res.send({ otp, service })
        } else {
            order.status = 'completed'
            await order.save()
            await payment.save()
            res.send({ otp, order })
        }
    } catch (e) {
        res.status(500).send({ error: e })
    }
})

router.post('/push', auth, async (req, res) => {
    try {
        const payment = await Payment.findOne({ merchantId: req.user._id, otp: req.body.otp })
        // console.log(payment)
        if (!payment) {
            return res.status(400).send({ error: 'Invalid data' })
        }
        // const customer = await Customer.findById(payment.customerId)
        // console.log(customer)
        try {
            payment.status = 'completed'
            payment.otp = undefined
            await payment.save()
            console.log('successful')
            res.send({ success: 'payment successful' })
        } catch (e) {
            // console.log(e)
            res.send({ error: 'failed' })
        }
    } catch (e) {
        // console.log(e)
        res.send({ error: 'failed' })
    }
})

module.exports = router

