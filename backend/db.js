const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/paytm')

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String
})

const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('User', userSchema)
const Account = mongoose.model('Account', accountSchema)

module.exports = {
    User,
    Account
}