const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const { sendVerificationCode } = require('../emails/account')
const Inventory = require('../models/inventory')
const Order = require('../models/order')
const Service = require('../models/service')
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
    accessKeyId: require('../../config').AWS_ACCESS_ID,
    secretAccessKey: require('../../config').AWS_SECRET_KEY
})

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({ storage }).single('image')

router.post('/users/verifyEmail', async (req, res) => {
    console.log(req.body.email)
    try {
        const vCode = await sendVerificationCode(req.body.email)
        console.log(vCode)
        res.send(vCode.toString())
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/uploadImage', upload, async (req, res) => {
    console.log('uploading')
    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const params = {
        Bucket: require('../../config').AWS_BUCKET_NAME,
        Key: `${uuidv4()}.${fileType}`,
        Body: req.file.buffer
    }
    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send(error)
        }
        else {
            console.log(data);
            res.status(200).send({ url: data.Location })
        }
    })
})

router.post('/users/newUser', async (req, res) => {
    const user = new User(req.body)
    console.log(user)
    try {
        const token = await user.generateAuthToken()
        console.log(token)
        if (user.typeOfMerchant === 'goods') {
            const inventory = new Inventory({
                categories: [],
                owner: user._id
            })
            await user.save()
            await inventory.save()
            return res.status(201).send({ user, token, inventory: [] })
        }
        else {
            return res.status(201).send({ user, token })
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/findUser', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        console.log(user)
        if (user) {
            const token = await user.generateAuthToken()
            if (user.typeOfMerchant === 'goods') {
                const inventory = await Inventory.findOne({ owner: user._id })
                const orders = await Order.find({ merchantId: user._id })
                console.log(inventory)
                console.log(orders)
                return res.send({ user, token: token, inventory, orders, existingUser: true })
            } else if (user.typeOfMerchant === 'service') {
                const requests = await Service.find({ merchantId: user._id })
                console.log(requests)
                return res.send({ user, token: token, requests, existingUser: true })
            }
            return res.send({ user, token, existingUser: true })
        }
        return res.status(404).send({ existingUser: false })
    } catch (e) {
        res.send(e)
    }
})

router.post('/users/getUserFromToken', async (req, res) => {
    try {
        const user = await User.findByToken(req.body)
        if (user) {
            if (user.typeOfMerchant === 'goods') {
                const inventory = await Inventory.findOne({ owner: user._id })
                const orders = await Order.find({ merchantId: user._id })
                return res.send({ user, token: req.body.token, inventory, orders })
            } else if (user.typeOfMerchant === 'service') {
                const requests = await Service.find({ merchantId: user._id })
                console.log(requests)
                return res.send({ user, token: req.body.token, requests, existingUser: true })
            }
            return res.send({ user, token: req.body.token })
        }
        return res.status(404).send({ error: 'User not found' })
    } catch (e) {
        res.send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'merchantName', 'pan', 'shopName']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})










//shop pic

// const upload = multer({
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload an image'))
//         }
//         cb(undefined, true)
//     }
// })

// router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
//     const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer()
//     req.user.avatar = buffer
//     await req.user.save()
//     res.send()    
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

// router.get('/users/:id/avatar', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)
//         if (!user || !user.avatar) {
//             throw new Error()
//         }
//         res.set('Content-Type', 'image/png')
//         res.send(user.avatar)
//     } catch (e) {
//         res.status(404).send()
//     }
// })

// router.delete('/users/me/avatar', auth, async (req, res) => {
//     try {
//         req.user.avatar = undefined
//         await req.user.save()
//         res.send(req.user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router