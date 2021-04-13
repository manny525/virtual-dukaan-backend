const mongoose = require('mongoose')
const validator = require('validator')

const loyaltySchema = new mongoose.Schema({
    points: {
        type: Number,
        required: true,
        trim: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    promocode: {
        type: String,
        trim: true,
        default: ''
    }
})

const Loyalty = mongoose.model('Loyalty', loyaltySchema)

module.exports = Loyalty