const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Inventory = require('./inventory')
const JWT_SECRET = require('../../config').JWT_SECRET;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, 
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }
    },
    merchantName: {
        type: String,
        required: true,
        trim: true
    },
    shopName: {
        type: String,
        required: false,
        trim: true
    },
    typeOfMerchant: {
        type: String,
        required: true
    },
    providerOf: {
        type: String,
        required: true
    },
    location: {
        lat: {
            type: String,
            required: true
        },
        lon: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        }
    },
    imageUrl: {
        type: String,
        required: true,
        default: 'https://online-dukaan-bucket.s3.ap-south-1.amazonaws.com/default.jpg'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('service',{
    ref:'service',
    localField:'_id',
    foreignField:'merchant'
})

userSchema.virtual('PlaceOrder',{
    ref:'PlaceOrder',
    localField:'_id',
    foreignField:'merchantID'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString()}, JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByToken = async ({ token, _id }) => {
    const user = await User.findById(_id)
    let returnUser = null
    user.tokens.forEach(userToken => {
        console.log(userToken)
        if (userToken.token === token) {
            returnUser = user
        }
    })
    return returnUser
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.tokens

    return userObject
}

//hash the plain text password before saving
// userSchema.pre('save', async function (next) {
//     const user = this

//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next()
// })

//delete user inventory when user is removed

userSchema.pre('remove', async function (next) {
    const user = this
    await Inventory.deleteOne({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User