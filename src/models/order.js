const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'Customer'
    },
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: 'pending',
        required: true
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        itemName: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true
        },
        sellingPrice: {
            type: String,
            required: true
        }
    }],
    totalCost: {
        type: Number,
        required: true,
    },
    pickUpTime: {
        date: {
            type: String,
            required: true
        },
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    },
    paymentStatus: {
        type: Number,
        default: 0,
        required: true
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order