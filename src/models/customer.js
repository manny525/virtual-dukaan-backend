const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const randomize = require('randomatic')
const Cards = require('./card')
const Loyalty = require('./loyalty');
const JWT_SECRET = require('../../config').JWT_SECRET;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    contact: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value, 'any')) {
                throw new Error('Not a Phone Number')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
})

userSchema.methods.toJSON = function () {
    const user = this
    const userobj = user.toObject()
    delete userobj.tokens
    return userobj
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.pre('remove', async function (next) {
    const user = this
    await Cards.deleteMany({ owner: user._id })
    await Loyalty.deleteMany({ customer: user._id })
    next()
})

const User = mongoose.model('Customer', userSchema)
module.exports = User

