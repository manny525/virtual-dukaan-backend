const express = require('express')
const Loyalty = require('./../models/loyalty')
require('./../db/mongoose')
const router = new express.Router()
const auth = require('./../middleware/auth_customer')
const  randomize = require('randomatic')
const mongoose = require('mongoose')

router.post('/add/loyalty',auth,async(req,res)=>{
    try{
        const loyalty = new Loyalty({
            ...req.body,
            customer:req.user._id
        })
        await loyalty.save()
        res.send()
    }catch(error){
        res.status(400).send({error})
    }
})

router.get('/get/promocode',auth,async(req,res)=>{
    try{
        const loyalty = await Loyalty.findOne({customer:req.user._id,merchant:mongoose.Types.ObjectId(req.body.merchant)})
        
        if(!loyalty.promocode){
            if(loyalty.points<100){
                return res.status(400).send({error:'points less than 100'})
            }
            loyalty.promocode=randomize('Aa0',10)
            await loyalty.save()    
        }
        res.send(loyalty)
    }catch(error){
        res.status(400).send({error:'my error'})
    }
})

router.delete('/promocode',auth,async(req,res)=>{
    try{
        const loyalty = await Loyalty.findOne({customer:req.user._id,merchant:mongoose.Types.ObjectId(req.body.merchant)})
        if(loyalty.promocode){
            loyalty.points = loyalty.points - 100
        }
        loyalty.promocode = undefined
        await loyalty.save()
        res.send(loyalty)
    }catch(e){
        res.status(400).send({error:e})
    }
})

router.get('/loyalty',auth,async(req,res)=>{
    try{
        await req.user.populate({
            path:'Loyalty',
        }).execPopulate()
        res.send(req.user.Loyalty)
    }catch(error){
        res.status(400).send({error})
    }
})

router.patch('/loyalty',auth,async(req,res)=>{
    try{
        const  loyalty = await Loyalty.findOneAndUpdate({customer:req.user._id,merchant:req.body.merchant}, {$inc:{points:req.body.value}})
        res.send()
    }catch(error){
        res.status(400).send({error})
    }
})
module.exports = router