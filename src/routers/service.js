const Service = require('./../models/service')
const auth = require('./../middleware/auth_customer')
const express = require('express')
const router = new express.Router()
const auth_merchant = require('../middleware/auth')
// const moment = require('moment')

router.post('/services/new', auth ,async(req,res)=>{
    try{
        const service = new Service({
            ...req.body,
            customerName: req.user.name,
            customerId: req.user._id
        })
        await service.save() 
        console.log(service)
        res.send(service)     
    }catch(error){
        res.status(400).send({error})
    }
})

router.get('/services/merchant', auth_merchant, async (req, res) => {
    try {
        var orders= new Array();
        orders = await Service.find({ merchantId: req.user._id })
        if (!orders) {
            return res.status(404).send()
        }
        res.send(orders)
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/services/customer', auth, async(req,res)=>{
    try {
        var orders = new Array();
        orders = await Service.find({ customerId: req.user._id })
        if (!orders) {
            return res.status(404).send()
        }
        res.send(orders)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/services/status', auth_merchant, async (req, res) => {
    console.log(req.body)
    try {
        const service = await Service.findById(req.body._id)
        console.log(service)
        if (!service) {
            res.status(404).send({message: 'Not found'})
        }
        if (service.status === 'new') {
            service.time = req.body.time
        }
        service.status = req.body.status
        await service.save()
        console.log(service)
        res.send(service)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/services/delete',async(req,res)=>{
    try{
        await Service.findOneAndRemove(req.body)
        res.send()
    }catch(error){
        res.status(400).send({error})
    }
})


module.exports = router