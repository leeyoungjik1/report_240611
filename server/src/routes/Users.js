const express = require('express')
const User = require('../models/User')
const { generateToken, isAuth } = require('../../auth')
const expressAsyncHandler = require('express-async-handler')
const moment = require('moment')
const { validationResult, oneOf } = require('express-validator')
const {
    validateUserName,
    validateUserNickName,
    validateUserPassword,
    validateUserEmail,
    validateUserId
} = require('../../validator')

// URL 주소: /api/users

const router = express.Router()

// 회원가입
router.post('/register', [
    validateUserName(),
    validateUserNickName(),
    validateUserEmail(),
    validateUserId(),
    validateUserPassword()
], expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({
            code: 400,
            message: 'Invaild Form data for user',
            error: errors.array()
        })
    }else{
        const user = new User({
            name: req.body.name,
            nickName: req.body.nickName,
            email: req.body.email,
            userId: req.body.userId,
            password: req.body.password
        })
        user.save()
        .then(() => {
            const {name, nickName, email, userId, isAdmin, createdAt} = user
            res.json({
                code: 200,
                token: generateToken(user),
                name, nickName, email, userId, isAdmin, createdAt
            })
        })
        .catch(e => {
            if(e.errmsg === `E11000 duplicate key error collection: project_TravelNote.users index: userId_1 dup key: { userId: "${user.userId}" }`){
                res.status(400).json({code: 400, message: '아이디 중복'})
            }else{
                res.status(400).json({code: 400, message: 'Invalid User Data'})
            }
        })
    }
}))

// 로그인
router.post('/login', expressAsyncHandler(async (req, res, next) => {
    const loginUser = await User.findOne({
        userId: req.body.userId,
        password: req.body.password
    })
    if(!loginUser){
        res.status(401).json({code: 401, messager: '유효하지 않은 로그인 정보'})
    }else{
        const {name, nickName, email, userId, isAdmin, createdAt} = loginUser
        res.json({
            code: 200,
            token: generateToken(loginUser),
            name, nickName, email, userId, isAdmin, createdAt
        })
    }
}))

// 회원정보 수정
router.put('/modify', oneOf([
    validateUserNickName(),
    validateUserEmail(),
    validateUserPassword()
]), isAuth, expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({
            code: 400,
            message: 'Invaild Form data for user',
            error: errors.array()
        })
    }else{
        const user = await User.findById(req.user._id)
        if(!user){
            res.status(404).json({code: 404, message: '수정 유저 정보 없음'})
        }else{
            user.nickName = req.body.nickName || user.nickName
            user.email = req.body.email || user.email
            user.password = req.body.password || user.password
            user.lastModifiedAt = moment()
    
            const updateUser = await user.save()
            const {name, nickName, email, userId, isAdmin, createdAt} = user
            res.json({
                code: 200,
                token: generateToken(updateUser),
                name, nickName, email, userId, isAdmin, createdAt
            })
        }
    }
}))

// 회원탈퇴
router.delete('/del', isAuth, expressAsyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.user._id)
    if(!user){
        res.status(404).json({code: 404, message: '삭제 유저 정보 없음'})
    }else{
        res.status(204).json({code: 204, message: '유저 탈퇴 완료'})
    }
}))


router.get('/getId', isAuth, expressAsyncHandler(async (req, res, next) => {
    res.json(req.user)
}))


// 테스트
const Destination = require('../models/Destination')
const ItineraryByDate = require('../models/ItineraryByDate')
const Itinerary = require('../models/Itinerary')

router.get('/test', expressAsyncHandler(async (req, res, next) => {
    const itinerarys = await Itinerary.find().populate('userId').populate({
        path: 'itineraryByDateIds',
        populate: {path: 'destinationIds'}
    })
    res.json(itinerarys)
}))






module.exports = router