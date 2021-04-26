const User = require('../models/customer')
const Cart = require('../models/cart')
const Card = require('../models/card')
const Service = require('../models/service')
const Order = require('../models/order')
const auth = require('../middleware/auth_customer')
const check = require('../middleware/number_verification/number')
const { sendVerificationCode } = require('../emails/account')
const { items } = require('../models/cart')
const express = require('express')
const router = new express.Router()

router.post('/customer/verifyEmail', async (req, res) => {
    try {
        const vCode = await sendVerificationCode(req.body.email)
        console.log(vCode);
        res.send({ vCode: vCode.toString() })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/customer/register', check, async (req, res) => {
    const user = new User(req.body)
    const token = await user.generateAuthToken()
    console.log(token)
    try {
        await user.save()
        console.log(user)
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/customer/findUser', async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.findOne({ email: req.body.email })
        console.log(user)
        if (user) {
            const token = await user.generateAuthToken()
            console.log(token)
            const userData = {
                user,
                carts: await Cart.find({ customerId: user._id }),
                cards: await Card.find({ owner: user._id }),
                services: await Service.find({ customerId: user._id }),
                orders: await Order.find({ customerId: user._id }),
                token,
                existingUser: true
            }
            console.log(userData)
            return res.send(userData)
        }
        return res.status(404).send({ existingUser: false })
    } catch (e) {
        res.send(e)
    }
})

router.post('/customer/loginByToken', auth, async (req, res) => {
    console.log(req.body)
    try {
        const user = req.user
        const userData = {
            user,
            carts: await Cart.find({ customerId: req.user._id }),
            cards: await Card.find({ owner: req.user._id }),
            orders: await Order.find({ customerId: req.user._id }),
            services: await Service.find({ customerId: req.user._id }),
            token: req.header('Authorization').replace('Bearer ', '')
        }
        console.log(userData)
        res.send(userData)
    } catch (error) {
        res.status(400).send({ error })
    }
})

router.post('/customer/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tk) => {
            return tk.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Delete User Account
router.delete('/customer/me', auth, async (req, res) => {
    const _id = req.user._id
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// //Update User Info
// router.patch('/customer/me', auth, async (req, res) => {
//     const allow = ['name']
//     const up = Object.keys(req.body)
//     const isValid = up.every((up) => {
//         return allow.includes(up)
//     })
//     if (isValid === false) {
//         return res.status(400).send({ error: 'invalid updates' })
//     }
//     try {
//         up.forEach((up) => {
//             req.user[up] = req.body[up]
//         })
//         await req.user.save()
//         res.send()
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })


// //Get User Profie Info
// router.get('/customer/me', auth, async (req, res) => {
//     res.send(req.user)
// })


module.exports = router