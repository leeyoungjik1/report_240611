const mongoose = require('mongoose')
const moment = require('moment')

const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    nickName: {
        type: String,
        default: 'Traveler'
    },
    email: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: moment()
    },
    lastModifiedAt: {
        type: Date,
        default: moment()
    }
})


userSchema.path('email').validate(function(value){
    return /^[a-zA-Z0-9]+@{1}[a-z]+(\.[a-z]{2})?(\.[a-z]{2,5})$/.test(value)
}, 'email `{VALUE}` 는 잘못된 이메일 형식입니다.')

// 숫자, 특수문자 최소 1개 포함 (7~15자)
userSchema.path('password').validate(function(value){
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}/.test(value)
}, 'password `{VALUE}` 는 잘못된 비밀번호 형식입니다.')

const User = mongoose.model('User', userSchema)
module.exports = User



// const user = new User({
//   name: '태양',
//   email: 'sun@gmail.com',
//   userId: 'admin',
//   password: 'dddddddd2#',
//   confirmPassword: 'dddddddd2#'
// })
// user.save().then(() => console.log('user created !'))