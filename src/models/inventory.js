const mongoose = require('mongoose')

const inventorySchema = mongoose.Schema({
    categories: [{
        items: [{
            itemName: {
                type: String,
                required: true,
                trim: true
            },
            available: {
                type: Boolean,
                required: true
            },
            sellingPrice: {
                type: String,
                required: true
            }
        }],
        categoryName: {
            type: String
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Inventory = mongoose.model('Inventory', inventorySchema)

module.exports = Inventory