const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth_customer = require('./../middleware/auth_customer')
//Search By PostalCode
router.get('/search', auth_customer, async (req, res) => {
    // console.log(req.query)
    try {
        var merchants = await User.find({ "location.postalCode": req.query.postalCode, typeOfMerchant: req.query.typeOfMerchant })
        var p = new Array()
        var i
        for (i = 0; i < merchants.length; i++) {
            const d = await distance({ lat: merchants[i].location.lat, lng: merchants[i].location.lon }, { lat: req.query.lat, lng: req.query.lon }) * 1.609344
            // console.log(d)
            p.push({ _id: merchants[i]._id, shopName: merchants[i].shopName, merchantName: merchants[i].merchantName,address: merchants[i].location, type: merchants[i].providerOf, distance: d })
        }
        // console.log(p)
        res.send(p)
    } catch (error) {
        res.status(400).send({ error })
    }
})


module.exports = router

async function distance(mk1, mk2) {
    var R = 3958.8; // Radius of the Earth in miles
    var rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

    var d = 2 * R * await Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return d;
}

